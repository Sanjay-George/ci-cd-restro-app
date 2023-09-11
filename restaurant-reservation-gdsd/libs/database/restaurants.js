const { pool } = require("./config");
const dayjs = require("dayjs");

// TODO: Update table and column names once data is set on local
// TODO: remove select *
const getTrending = (limit = 5) => {
  const query = `
        SELECT res.*, 
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', img.id,
              'path', img.path,
              'menuImage', img.isMenuImage
            )
          )
          FROM images AS img
          WHERE img.restaurantID = res.id and status='Approved'
        ) AS images,
        avg(re.rating) as rating
        FROM restaurants as res 
        LEFT JOIN reviews re
        ON re.restaurantID = res.id
        WHERE res.status='approved'
        GROUP BY res.id
        HAVING avg(re.rating) > 3
        LIMIT ${limit}
        `;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const getRestaurantDetails = (id) => {
  const query = `
        SELECT res.*, avg(re.rating) as rating, 
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', img.id,
              'path', img.path,
              'menuImage', img.isMenuImage
            )
          )
          FROM images AS img
          WHERE img.restaurantID = res.id and status='Approved'
        ) AS images
        FROM restaurants res
        LEFT JOIN reviews re
        ON re.restaurantID = res.id
        WHERE res.id = ${id}
        GROUP BY res.id
        `;
  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const getAllRestaurants = (limit = 5) => {
  const query = `
          SELECT r.*, u.firstName as ownerFirstName, u.lastName as ownerLastName 
          FROM restaurants as r
          LEFT JOIN users as u 
          ON r.userId = u.id
          LIMIT ${limit} 
          `;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const updateRestaurantStatus = (status, restaurantId) => {
  const query = `
          UPDATE restaurants SET status='${status}' WHERE id=${restaurantId}
          `;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const addRestaurant = ({
  name,
  postalCode,
  address,
  city,
  cuisine,
  maxCapacity,
  maxTables,
  restaurantNote,
  gracePeriod = 0,
  timeInterval = 0,
  userId,
}) => {
  const sql = `INSERT INTO restaurants 
    (name, postalCode, address, city, cuisine, maxCapacity, maxTables, 
        restaurantNote, gracePeriod, timeInterval, status, userId) 
    VALUES ('${name}', ${postalCode} ,'${address}', '${city}', '${cuisine}',
    ${maxCapacity}, ${maxTables}, '${
    restaurantNote || ""
  }', ${gracePeriod}, ${timeInterval}, 'pending', ${userId})`;

  return new Promise((resolve, reject) => {
    pool.query(sql, (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

const getMyRestaurants = (limit = 5, userId) => {
  const query = `
          SELECT 
          res.*,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', img.id,
                'path', img.path,
                'menuImage', img.isMenuImage
              )
            )
            FROM images AS img
            WHERE img.restaurantID = res.id and status='Approved'
          ) AS images
        FROM restaurants AS res
        WHERE res.userId = ${userId}
        LIMIT ${limit}
          `;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const updateRestaurant = ({
  name,
  postalCode,
  address,
  city,
  cuisine,
  maxCapacity,
  maxTables,
  restaurantNote,
  gracePeriod = 0,
  timeInterval = 0,
  restaurantId,
  userId,
}) => {
  const sql = `UPDATE restaurants SET name = '${name}', postalCode = ${postalCode}, 
    address = '${address}', city = '${city}', cuisine = '${cuisine}', 
    maxCapacity = ${maxCapacity}, maxTables = ${maxTables},
    restaurantNote = '${restaurantNote}', gracePeriod = ${gracePeriod}, timeInterval = ${timeInterval}, status='pending' WHERE id=${restaurantId} AND userId=${userId}`;

  return new Promise((resolve, reject) => {
    pool.query(sql, (error, result, fields) => {
      if (error) reject(error);

      resolve(result);
    });
  });
};

const deleteRestaurant = (userId, restaurantId, role) => {
  let sql = `DELETE FROM restaurants
    WHERE id=${restaurantId}`;

  if (role === "restaurantOwner") {
    sql = sql + ` AND userId=${userId}`;
  }

  return new Promise((resolve, reject) => {
    pool.query(sql, (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

const getAllApprovedRestaurants = (limit = 5) => {
  const query = `
          SELECT res.*, 
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', img.id,
                'path', img.path,
                'menuImage', img.isMenuImage
              )
            )
            FROM images AS img
            WHERE img.restaurantID = res.id and status='Approved'
          ) AS images,
          avg(re.rating) as rating
          FROM restaurants as res 
          LEFT JOIN reviews re
          ON re.restaurantID = res.id
          WHERE res.status='approved'
          GROUP BY res.id
          LIMIT ${limit}
          `;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

module.exports = {
  getTrending,
  addRestaurant,
  getRestaurantDetails,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
  getAllRestaurants,
  updateRestaurantStatus,
  getAllApprovedRestaurants,
};
