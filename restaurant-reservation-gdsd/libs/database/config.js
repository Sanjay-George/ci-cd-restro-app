const mysql = require("mysql2");

/* File Author: Sanjay George */
require("dotenv").config();

let pool;
const initializeConnectionPool = () => {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USERNAME || "root",
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT || 3306,
    database: "reserveat",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

initializeConnectionPool();

module.exports = {
  pool,
};
