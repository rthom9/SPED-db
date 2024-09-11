// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: File
// Date: 03 / 16 / 2024
// Originality: Adapted
// Purpose: This file is used to create a connection pool to the database and execute queries.

var mysql = require('mysql');
var db = require("./db-connector");

const HOST = process.env.HOST
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE

console.log(HOST, USER, PASSWORD, DATABASE)
// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit: 10,
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
})

// This function is used to execute a query and return a promise
// that will resolve with the results of the query 
async function executeQuery(query) {
    return await new Promise((resolve, reject) => {
        db.pool.query(query, function (error, rows, fields) {
            if (error) {
                reject(error);
            } else {
                resolve({ rows, fields });
            }
        });
    });
}
// Export it for use in our application
module.exports.pool = pool;
exports.executeQuery = executeQuery;
