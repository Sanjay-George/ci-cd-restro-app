const { pool } = require("./config");

/* File author: Sanjay George */

const getImages = (
  restaurantId,
  status = "approved",
  count = 20,
  offset = 0
) => {
  const statusCheck = status !== "all" ? `and i.status = "${status}"` : "";

  const query = `
      select i.*, r.name as restaurantName from images i
      inner join restaurants r on i.restaurantid = r.id 
      where i.restaurantid = ${restaurantId}
      ${statusCheck}
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

const getMenuImages = (restaurantId, count = 20, offset = 0) => {
  const query = `
      select i.*, r.name as restaurantName from images i
      inner join restaurants r on i.restaurantid = r.id 
      where i.restaurantid = ?
      and i.status = "approved"
      and i.ismenuimage = true
      limit ?
      offset ?;
      `;

  return new Promise((resolve, reject) => {
    pool.query(query, [restaurantId, count, offset], function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const getImage = (imageId) => {
  const query = `
      select * from images 
      where id = ?
      `;

  return new Promise((resolve, reject) => {
    pool.query(query, [imageId], function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const deleteImage = (imageId) => {
  const sql = `
        delete from images where id = ?;
    `;

  return new Promise((resolve, reject) => {
    pool.query(sql, [imageId], (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

const addImage = (restaurantId, path, isMenuImage) => {
  const sql = `insert into images (restaurantid, status, path, ismenuimage)
    values (?, "uploaded", ?, ${isMenuImage});`;

  return new Promise((resolve, reject) => {
    pool.query(sql, [restaurantId, path], (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

const updateImageStatus = (imageId, status) => {
  if (!status) return;

  const sql = `
      update images 
      set status = ?
      where id = ?`;

  return new Promise((resolve, reject) => {
    pool.query(sql, [status, imageId], (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

module.exports = {
  getImages,
  getMenuImages,
  getImage,
  deleteImage,
  addImage,
  updateImageStatus,
};
