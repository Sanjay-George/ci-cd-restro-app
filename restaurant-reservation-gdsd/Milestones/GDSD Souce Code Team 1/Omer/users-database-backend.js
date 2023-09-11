const { pool } = require("./config");

const putUser = (email, password, firstName, lastName, phonenumber) => {
  const emailQuery = `Select email FROM users WHERE email = '${email}'`;
  const query = `INSERT INTO users (email, password, firstName, lastName, phonenumber, roleId) VALUES ('${email}', '${password}','${firstName}','${lastName}','${phonenumber}' , 1)`;

  return new Promise((resolve, reject) => {
    pool.query(emailQuery, function (error, results) {
      if (error) reject(error);
      try {
        if (results.length > 0) {
          reject("User already exists");
        } else {
          pool.query(query, function (error, results) {
            if (error) reject(error);
            try {
              resolve(results);
            } catch (ex) {
              console.error(ex);
            }
          });
        }
      } catch (ex) {
        console.error(ex);
      }
    });
  });
};
const login = (email) => {
  const query = `SELECT us.id, us.firstName, us.lastName, us.phonenumber, us.email, us.password, r.name as role FROM users us INNER JOIN roles as r ON us.roleId = r.id WHERE email ='${email}'`;
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

const assignRole = (email, roleId) => {
  const emailQuery = `Select email FROM users WHERE email = '${email}'`;
  const query = `UPDATE users SET roleId = '${roleId}' WHERE email ='${email}'`;
  return new Promise((resolve, reject) => {
    pool.query(emailQuery, function (error, results) {
      if (error) reject(error);
      try {
        if (results.length == 0) {
          reject("User does not exist");
        } else {
          pool.query(query, function (error, results) {
            if (error) reject(error);
            try {
              resolve(results);
            } catch (ex) {
              console.error(ex);
            }
          });
        }
      } catch (ex) {
        console.error(ex);
      }
    });
  });
};

const getMyProfile = (userId) => {
  const query = `SELECT us.*, r.points as rewardPoints, roles.name as roleName FROM users us INNER JOIN rewards as r ON r.userId = us.id INNER JOIN roles ON roles.id = us.roleId WHERE us.id=${userId}`;
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

module.exports = {
  putUser,
  login,
  assignRole,
  getMyProfile,
};
