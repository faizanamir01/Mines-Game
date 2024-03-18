var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Fa*mysql12345",
    database: "minesDB"
});

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM gameStats", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
    con.end((error) => {
        if (error) {
            console.error('Error! closing MySQL connection:', error);
            return;
        }
    });
});