var mysql = require('mysql');

var con = mysql.createConnection(
{
    host: "localhost",
    user: "root",
    password: "Fa*mysql12345"
});

con.connect(function(err) 
{
    if (err) throw err;
    console.log("Connected!");

    con.query("CREATE DATABASE minesDB", function (err, result) 
    {
        if (err) throw err;
        console.log("Database created");
    });

    con.end((error) => {
        if (error) {
            console.error('Error! closing MySQL connection:', error);
            return;
        }
    });
});
