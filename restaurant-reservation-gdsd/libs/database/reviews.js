const { pool } = require("./config");

/* File author: Sanjay George */

const getReviews = (restaurantId, count = 10, offset = 0) => {
  const query = `
    SELECT re.*, u.lastName, u.firstName, u.email, u.phoneNumber 
    FROM reviews re 
    inner join users u on re.userid = u.id
    inner join restaurants r on re.restaurantid = r.id
    inner join roles ro on u.roleid = ro.id
    where ro.id = 1
    and r.id = ${restaurantId}
    limit ${count}
    offset ${offset};
    `;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const getReview = (reviewId) => {
  const query = `
    SELECT re.*, u.lastName, u.firstName, u.email, u.phoneNumber
    FROM reviews re 
    inner join users u on re.userid = u.id
    inner join restaurants r on re.restaurantid = r.id
    inner join roles ro on u.roleid = ro.id
    where ro.id = 1
    and re.id = ${reviewId};
    `;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const addReview = (userId, restaurantId, rating, description) => {
  const sql = `insert into reviews (userid, restaurantid, rating, descriptionreview)
    values (${userId}, ${restaurantId}, ${rating}, "${description}");`;

  return new Promise((resolve, reject) => {
    pool.query(sql, (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

const updateReview = (reviewId, rating, description) => {
  const sql = `
    update reviews 
    set rating = ${rating}, descriptionreview = "${description}"
    where id = ${reviewId};`;

  return new Promise((resolve, reject) => {
    pool.query(sql, (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

const deleteReview = (reviewId, userId) => {
  const sql = `
    delete from reviews where id = ? and userid = ?
    `;

  return new Promise((resolve, reject) => {
    pool.query(sql, [reviewId, userId], (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

const getReviewByUserAndRestaurant = (userId, restaurantId) => {
  const query = `select * from reviews where userid = ? and restaurantId = ?`;

  return new Promise((resolve, reject) => {
    pool.query(query, [userId, restaurantId], function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

module.exports = {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  getReviewByUserAndRestaurant,
};
