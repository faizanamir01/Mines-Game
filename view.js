var mysql = require('mysql');

var con = mysql.createConnection({              // Create mysql connection
    host: "localhost",                          // Change the field values accordingly 
    user: "root",
    password: "Fa*mysql12345",
    database: "minesDB"
});

con.connect(function(err) {
    if (err) throw err;

    // Sql command to return the entries of the table
    con.query("SELECT * FROM gameStats", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        console.log(`\nTotal games played: ${result.length}\n`);
    });
    con.end((error) => {
        if (error) {
            console.error('Error! closing MySQL connection:', error);
            return;
        }
    });
});