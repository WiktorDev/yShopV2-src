const mysql = require ('mysql2');
const config = require('./config')

var pool = mysql.createPool ({
    multipleStatements: true,
    host: config.mysql_host,
    user: config.mysql_user,
    database: config.mysql_db,
    password: config.mysql_pass
});

module.exports = pool;