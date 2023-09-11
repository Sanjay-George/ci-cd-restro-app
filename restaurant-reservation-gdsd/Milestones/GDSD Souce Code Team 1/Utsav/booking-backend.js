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

// libs/database/booking.js
const { pool } = require("./config");
const dayjs = require("dayjs");

const addReservation = ({
  userId,
  restaurantId,
  numberOfSeats,
  date,
  time,
  extraServiceId,
  specialRequest,
}) => {
  const convertedDate = dayjs(date).format("YYYY-MM-DD");
  const lastUpdated = dayjs().format("YYYY-MM-DD");

  const insertReservationSql = `INSERT INTO reservations
            (userId, restaurantId, numberOfSeats, status, extraServiceId,
            lastUpdate , times, date, specialRequest)
            VALUES (${userId}, ${restaurantId} ,${numberOfSeats}, 'Reserved',
            ${extraServiceId}, '${lastUpdated}', ${time}, '${date}', '${specialRequest}')`;

  return new Promise((resolve, reject) => {
    pool.query(
      insertReservationSql,
      (insertReservationError, insertReservationResult) => {
        if (insertReservationError) {
          return reject(insertReservationError);
        }
        const seatsBookedSql = `SELECT * FROM restaurantTime WHERE restaurantID=${restaurantId} AND times=${time} AND date='${convertedDate}'`;

        pool.query(
          seatsBookedSql,
          (seatsBookedSqlError, seatsBookedSqlResult) => {
            if (seatsBookedSqlError) {
              return reject(seatsBookedSqlError);
            }

            var seatsBooked = seatsBookedSqlResult[0]?.seatsBooked || 0;
            var totalSeats = numberOfSeats + seatsBooked;

            let restaurantTimeQuery = `UPDATE restaurantTime SET seatsBooked = ${totalSeats} WHERE restaurantID = ${restaurantId} AND times = ${time} AND date = '${convertedDate}'`;

            if (seatsBookedSqlResult.length === 0) {
              restaurantTimeQuery = `
                INSERT INTO restaurantTime (times, availability, restaurantID, seatsBooked, date)
                  VALUES (${time}, true, ${restaurantId} ,${totalSeats}, '${convertedDate}')
              `;
            }

            let getRewardPointsSql = `SELECT * from rewards where userID=${userId}`;
            pool.query(
              restaurantTimeQuery,
              (updateRestaurantError, updateRestaurantResult) => {
                if (updateRestaurantError) {
                  return reject(updateRestaurantError);
                }
                pool.query(
                  getRewardPointsSql,
                  (rewardPointsSqlError, rewardPointsSqlResult) => {
                    if (rewardPointsSqlError) {
                      return reject(rewardPointsSqlError);
                    }

                    let prevRewardPoint = rewardPointsSqlResult[0]?.points || 0;
                    let newRewardPoint = prevRewardPoint + 25;

                    let updateRewardpointsSql = `UPDATE rewards SET points=${newRewardPoint} where userID=${userId}`;

                    if (rewardPointsSqlResult.length === 0) {
                      updateRewardpointsSql = `INSERT INTO rewards (userId, typeOf, points) 
                      VALUES ('${userId}', 'ForReservation', '25')`;
                    }
                    pool.query(
                      updateRewardpointsSql,
                      (pointsError, pointsResult) => {
                        if (pointsError) {
                          return reject(pointsError);
                        }
                        resolve(insertReservationResult);
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};

const cancelReservation = ({ userId, reservationId }) => {
  const resTimeSql = `SELECT * FROM reservations WHERE userId = ${userId} AND id = ${reservationId}`;
  return new Promise((resolve, reject) => {
    pool.query(resTimeSql, (error, resTimeResult) => {
      if (error) reject(error);
      const reservationRestaurantId = resTimeResult[0].restaurantId;
      const reservationTime = resTimeResult[0].times;
      const reservationBookedSeats = resTimeResult[0].numberOfSeats;
      const tableBookedSeatsSql = `SELECT seatsBooked FROM restaurantTime WHERE restaurantId =${reservationRestaurantId} AND times =${reservationTime}`;
      pool.query(tableBookedSeatsSql, (error2, tableBookedSeatsResult) => {
        if (error2) reject(error2);
        var tableBookedSeats = tableBookedSeatsResult[0].seatsBooked;
        var totalSeats = tableBookedSeats - reservationBookedSeats;
        const cancelSql = `UPDATE reservations SET status = 'Cancelled' WHERE userId = ${userId} AND id = ${reservationId}`;
        const updateRestaurantTimeSql = `UPDATE restaurantTime SET seatsBooked = ${totalSeats} WHERE restaurantId = ${reservationRestaurantId} AND times = ${reservationTime}`;
        if (resTimeResult) {
          pool.query(cancelSql, (error3, cancelResult) => {
            if (error3) reject(error3);
            pool.query(
              updateRestaurantTimeSql,
              (error4, updateRestaurantTimeResult) => {
                if (error4) reject(error4);
                let getRewardPointsSql = `SELECT * from rewards where userID=${userId}`;

                pool.query(
                  getRewardPointsSql,
                  (rewardPointsSqlError, rewardPointsSqlResult) => {
                    if (rewardPointsSqlError) {
                      return reject(rewardPointsSqlError);
                    }

                    let prevRewardPoint = rewardPointsSqlResult[0]?.points || 0;
                    let newRewardPoint = prevRewardPoint - 25;

                    let updateRewardpointsSql = `UPDATE rewards SET points=${newRewardPoint} where userID=${userId}`;

                    pool.query(
                      updateRewardpointsSql,
                      (pointsError, pointsResult) => {
                        if (pointsError) {
                          return reject(pointsError);
                        }
                        resolve(pointsResult);
                      }
                    );
                  }
                );
              }
            );
          });
        }
      });
    });
  });
};

const updateReservation = ({
  userId,
  restaurantId,
  numberOfSeats,
  date,
  time,
  extraServiceId,
  reservationId,
  specialRequest,
}) => {
  const convertedDate = dayjs(date).format("YYYY-MM-DD");
  const lastUpdated = dayjs().format("YYYY-MM-DD");

  const sql = `UPDATE reservations SET userId = ${userId}, restaurantId = ${restaurantId}, 
    numberOfSeats = ${numberOfSeats}, date = '${convertedDate}', times = ${time}, 
    extraServiceId = ${extraServiceId}, lastUpdate = '${lastUpdated}', specialRequest='${specialRequest}'
    WHERE userId = ${userId} AND id = ${reservationId}`;

  return new Promise((resolve, reject) => {
    pool.query(sql, (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

const checkReservationAvailability = (
  restaurantId,
  time,
  date,
  numberOfSeats
) => {
  const convertedDate = dayjs(date).format("YYYY-MM-DD");
  let currentDate = dayjs().format("YYYY-MM-DD");

  if (convertedDate >= currentDate) {
    const query = `SELECT * FROM restaurantTime WHERE restaurantID=${restaurantId} AND times=${time} AND date='${convertedDate}'`;
    return new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const restaurantSql = `SELECT maxCapacity FROM restaurants where id=${restaurantId}`;
          pool.query(
            restaurantSql,
            (restaurantSqlError, restaurantSqlResults) => {
              if (restaurantSqlError) {
                reject(restaurantSqlError);
              } else {
                const maxCapacity = restaurantSqlResults[0]?.maxCapacity || 0;

                const seatsBooked = results[0]?.seatsBooked || 0;

                const totalSeats = numberOfSeats + seatsBooked;

                if (totalSeats <= maxCapacity) {
                  resolve(results);
                } else {
                  const customError = new Error("Hello");
                  customError.status = "403";
                  customError.msg = `Maximum seats booked for this time. Seats available for this time is ${
                    maxCapacity - seatsBooked
                  }`;
                  reject(customError);
                }
              }
            }
          );
        }
      });
    });
  } else {
    const customError = new Error("Hello");
    customError.status = "403";
    customError.msg = `Booking date must be greated than current date`;
    throw customError;
  }
};

const getReservationByUser = (userId, restaurantId) => {
  const query = `select * from reservations where userid = ? and restaurantId = ? and status != "cancelled"`;

  return new Promise((resolve, reject) => {
    pool.query(
      query,
      [userId, restaurantId],
      function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const getUserReservations = (userId) => {
  const query = `SELECT reserv.*, res.name as restaurantName, res.address as restaurantAddress, res.city as restaurantCity, u.lastName, u.firstName, u.email as userEmail, u.phoneNumber as userPhone from reservations as reserv LEFT JOIN restaurants as res ON reserv.restaurantId=res.id LEFT JOIN users as u ON reserv.userId=u.id WHERE res.userId=${userId} GROUP BY reserv.id`;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

module.exports = {
  addReservation,
  cancelReservation,
  updateReservation,
  checkReservationAvailability,
  getReservationByUser,
  getUserReservations,
};
