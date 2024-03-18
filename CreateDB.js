var mysql = require('mysql');

var con = mysql.createConnection(               // Create mysql connection
{                                               // Change the field values accordingly 
    host: "localhost",
    user: "root",
    password: "Fa*mysql12345"
});

con.connect(function(err) 
{
    if (err) throw err;
    //console.log("Connected!");

    con.query("CREATE DATABASE minesDB", function (err, result) 
    {                                           // Sql command to create database
        if (err) throw err;
        console.log("Database created\n");
    });

    con.end((error) => {
        if (error) {
            console.error('Error! closing MySQL connection:', error);
            return;
        }
    });
});
