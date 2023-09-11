const express = require("express");
const router = express.Router();
const restaurantsDB = require("../database/restaurants");
const {
  validateInt,
  isStringUndefinedOrEmpty,
} = require("../utils/inputValidator");
const auth = require("../utils/auth");

router.get("/trending", async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await restaurantsDB.getTrending(limit);
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    const role = req.role;

    if (role !== "admin") return res.status(400).json("You are not authorized");

    const { limit } = req.query;
    const data = await restaurantsDB.getAllRestaurants(limit);
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.patch("/update-status", auth, async (req, res) => {
  try {
    const role = req.role;
    const { status, restaurantId } = req.body;

    if (role !== "admin") return res.status(400).json("You are not authorized");

    await restaurantsDB.updateRestaurantStatus(status, restaurantId);
    return res.send({ msg: "Status successfully updated" });
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.post("/", auth, async (req, res) => {
  const role = req.role;
  const userId = req.userId;
  if (role !== "restaurantOwner")
    return res
      .status(400)
      .json("You do not have the rights to add a restaurant");

  try {
    const {
      name,
      postalCode,
      address,
      city,
      cuisine,
      maxCapacity,
      maxTables,
      restaurantNote,
      gracePeriod,
      timeInterval,
    } = req.body;

    if (
      isStringUndefinedOrEmpty(name) ||
      !validateInt(postalCode) ||
      isStringUndefinedOrEmpty(address) ||
      isStringUndefinedOrEmpty(city)
    ) {
      return res.status(400).json("Invalid name, address or postal code");
    }
    if (
      !validateInt(maxCapacity) ||
      !validateInt(maxTables) ||
      isStringUndefinedOrEmpty(cuisine)
    ) {
      return res.status(400).json("Invalid cuisine, maxTable or maxCapacity");
    }
    if (!validateInt(gracePeriod) || !validateInt(timeInterval)) {
      return res
        .status(400)
        .json("Invalid grace period or time interval between bookings");
    }

    const insertId = await restaurantsDB.addRestaurant({
      name,
      postalCode,
      address,
      city,
      cuisine,
      maxCapacity,
      maxTables,
      restaurantNote,
      gracePeriod,
      timeInterval,
      userId,
    });
    return res.send({ msg: "Added succesfully", url: `api/restaurants` });
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.get("/my-restaurants", auth, async (req, res) => {
  try {
    const role = req.role;
    const userId = req.userId;

    if (role !== "restaurantOwner")
      return res
        .status(400)
        .json("You do not have the rights to add a restaurant");

    const { limit } = req.query;
    const data = await restaurantsDB.getMyRestaurants(limit, userId);
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.put("/update/:id", auth, async (req, res) => {
  const role = req.role;
  const userId = req.userId;
  const { id: restaurantId } = req.params;

  if (role !== "restaurantOwner")
    return res.status(400).json("You are not authorized");
  try {
    const {
      name,
      postalCode,
      address,
      city,
      cuisine,
      maxCapacity,
      maxTables,
      restaurantNote,
      gracePeriod,
      timeInterval,
    } = req.body;

    if (
      isStringUndefinedOrEmpty(name) ||
      !validateInt(postalCode) ||
      isStringUndefinedOrEmpty(address) ||
      isStringUndefinedOrEmpty(city)
    ) {
      return res.status(400).json("Invalid name, address or postal code");
    }
    if (
      !validateInt(maxCapacity) ||
      !validateInt(maxTables) ||
      isStringUndefinedOrEmpty(cuisine)
    ) {
      return res.status(400).json("Invalid cuisine, maxTable or maxCapacity");
    }
    if (!validateInt(gracePeriod) || !validateInt(timeInterval)) {
      return res
        .status(400)
        .json("Invalid grace period or time interval between bookings");
    }

    const result = await restaurantsDB.updateRestaurant({
      name,
      postalCode,
      address,
      city,
      cuisine,
      maxCapacity,
      maxTables,
      restaurantNote,
      gracePeriod,
      timeInterval,
      restaurantId,
      userId,
    });

    if (result?.affectedRows > 0) {
      return res.send({ msg: "Updated succesfully", url: `api/restaurants` });
    } else {
      return res.status(401).send({
        msg: "You are not authorized to change",
        url: `api/restaurants`,
      });
    }
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.delete("/:id", auth, async (req, res) => {
  const role = req.role;
  const userId = req.userId;
  const { id: restaurantId } = req.params;

  if (role !== "admin" && role !== "restaurantOwner")
    return res
      .status(400)
      .json("You do not have the rights to delete a restaurant");
  try {
    const result = await restaurantsDB.deleteRestaurant(
      userId,
      restaurantId,
      role
    );

    if (result?.affectedRows > 0) {
      return res.send({ msg: "Delete succesfull", url: `api/restaurants` });
    } else {
      return res.status(401).send({
        msg: "You are not authorized to delete this restaurant",
        url: `api/restaurants`,
      });
    }
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

// GET /api/restaurants/{id}
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateInt(id)) {
    return res.sendStatus(400);
  }
  try {
    const data = await restaurantsDB.getRestaurantDetails(id);
    if (!data || !data.length) {
      return res.sendStatus(404);
    }
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.get("/all/public", async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await restaurantsDB.getAllApprovedRestaurants(limit);
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

module.exports = router;
