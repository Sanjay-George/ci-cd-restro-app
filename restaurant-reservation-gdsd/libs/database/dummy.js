const { pool } = require("./config"); 

// TODO: Use prepared statements for statements with common access pattern (without variables)

const SCHEMA = "gdsd";
const TABLE = "rbs";

const getMultiple = (limit = 20) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM ${SCHEMA}.${TABLE} LIMIT ${limit}`, function (error, results, fields) {
            if (error)  reject(error);
            try{
                resolve(results);
            }
            catch(ex) {
                console.error(ex);
            }
        });
    });
};

module.exports = {
    getMultiple,
};