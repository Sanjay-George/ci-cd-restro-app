const { pool } = require("./config");

const get = (term, limit = 5, cuisine, rating) => {
  if (!term || !term.trim().length) return [];
  if (cuisine) {
    cuisine = ` AND res.cuisine = '${cuisine}'`;
  } else cuisine = ``;
  if (rating) {
    rating = ` AND rating = ${rating}`;
  } else rating = ``;

  const query = `SELECT res.*, avg(reviews.rating) as rating, 
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
      FROM restaurants as res 
      LEFT JOIN reviews
      ON res.id = reviews.restaurantID
      WHERE (res.name LIKE "%${term}%" OR res.address like "%${term}%" OR res.city like "%${term}%") ${cuisine} ${rating} 
      GROUP BY res.id
      ORDER BY avg(reviews.rating) DESC 
      LIMIT ${limit}`;

  //query += ` limit "${limit}"`;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      try {
        resolve(results);
      } catch (ex) {
        console.error(ex);
      }
    });
  });
};

const getExtraServices = () => {
  const query = `
        select id, name as value from extraServices 
        `;
  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results) {
      if (error) reject(error);
      try {
        resolve(results);
      } catch (ex) {
        console.error(ex);
      }
    });
  });
};

const getCuisine = () => {
  const cuisine = `
        SELECT DISTINCT cuisine
        FROM restaurants;
        `;

  return new Promise((resolve, reject) => {
    pool.query(cuisine, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const filterCuisine = (cuisine) => {
  const filter = `
        SELECT * 
        FROM restaurants 
        WHERE cuisine = '${cuisine}';
        `;

  return new Promise((resolve, reject) => {
    pool.query(filter, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};
module.exports = {
  get,
  getCuisine,
  filterCuisine,
  getExtraServices,
};
