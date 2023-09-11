const express = require("express");
const router = express.Router();
const bookingDB = require("../database/booking");
const {
  validateInt,
  isStringUndefinedOrEmpty,
} = require("../utils/inputValidator");
const auth = require("../utils/auth");

router.post("/", auth, async (req, res) => {
  const role = req.role;
  const userId = req.userId;

  if (role !== "user")
    return res
      .status(400)
      .json("You do not have the rights to Book a restaurant");
  try {
    const {
      restaurantId,
      numberOfSeats,
      date,
      time,
      extraServiceId = 0,
      specialRequest = "",
    } = req.body;

    if (!validateInt(restaurantId)) {
      return res
        .status(400)
        .json("Invalid user, restaurant or Extra Service ID");
    }
    if (!validateInt(numberOfSeats)) {
      return res.status(400).json("Invalid numberOfSeats or reservations");
    }

    const resp = await bookingDB.addReservation({
      userId,
      restaurantId,
      numberOfSeats,
      date,
      time,
      extraServiceId,
      specialRequest,
    });
    return res.send({
      msg: "Booking succesful",
      url: `api/booking`,
      reservationId: resp?.insertId,
    });
  } catch (ex) {
    console.log("ex", ex);
    if (ex.statusCode === 403) {
      return res.status(403).send({ msg: ex.msg });
    }
    return res.sendStatus(500);
  }
});

router.delete("/cancel/:id", auth, async (req, res) => {
  const role = req.role;
  const userId = req.userId;
  const { id: reservationId } = req.params;

  if (role != "user")
    return res
      .status(400)
      .json("You do not have the rights to Update a booking");
  try {
    await bookingDB.cancelReservation({
      userId,
      reservationId,
    });
    return res.send({ msg: "Reservation Cancelled", url: `api/booking` });
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.put("/update", auth, async (req, res) => {
  const role = req.role;
  const userId = req.userId;

  if (role !== "user")
    return res
      .status(400)
      .json("You do not have the rights to Update a booking");
  try {
    const {
      restaurantId,
      numberOfSeats,
      date,
      time,
      extraServiceId,
      reservationId,
      specialRequest,
    } = req.body;

    if (
      !validateInt(userId) ||
      !validateInt(restaurantId) ||
      !validateInt(extraServiceId)
    ) {
      return res
        .status(400)
        .json("Invalid user, restaurant or Extra Service ID");
    }
    if (!validateInt(numberOfSeats)) {
      return res.status(400).json("Invalid numberOfSeats");
    }
    if (!validateInt(date) || !validateInt(time)) {
      return res.status(400).json("Invalid date or time");
    }

    await bookingDB.updateReservation({
      userId,
      restaurantId,
      numberOfSeats,
      date,
      time,
      extraServiceId,
      reservationId,
      specialRequest,
    });
    return res.send({ msg: "Reservation Updated", url: `api/booking` });
  } catch (ex) {
    // console.error(ex);
    return res.sendStatus(500);
  }
});

router.post("/checkReservationAvailability/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  const { time, date, numberOfSeats } = req.body;

  if (!validateInt(restaurantId)) {
    return res.sendStatus(400);
  }

  try {
    await bookingDB.checkReservationAvailability(
      restaurantId,
      time,
      date,
      numberOfSeats
    );

    return res.send({ msg: "Reservation available", url: `api/booking` });
  } catch (ex) {
    if (ex.status == "403") {
      return res.status(403).send({ msg: ex.msg });
    }
    return res.sendStatus(500);
  }
});

router.get("/user-reservations", auth, async (req, res) => {
  const role = req.role;
  const userId = req.userId;

  if (role !== "restaurantOwner")
    return res.status(400).json("You do not have the rights to view these");
  try {
    const data = await bookingDB.getUserReservations(userId);

    return res.send(data);
  } catch (ex) {
    console.log(ex);
    return res.sendStatus(500);
  }
});

module.exports = router;
