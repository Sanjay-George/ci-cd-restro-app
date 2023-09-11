const mysql = require("mysql2");
const { getConfigValue } = require("../utils/configReader");

/* File Author: Sanjay George */

const dbConfig = getConfigValue("dbConfig");
require("dotenv").config();

let pool;

// Note: On local machine, configure your MYSQL password by setting environment variable `MYSQL_PASSWORD`

const initializeConnectionPool = () => {
  pool = mysql.createPool({
    host: dbConfig["host"],
    user: dbConfig["user"],
    password: process.env.MYSQL_PASSWORD,
    database: dbConfig["database"],
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

initializeConnectionPool();

module.exports = {
  pool,
};
