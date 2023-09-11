const { pool } = require("./config");

const getRewards = (userId) => {
  const query = `
        SELECT points 
        FROM rewards 
        WHERE userID = ${userId};
          `;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

module.exports = {
  getRewards,
};
