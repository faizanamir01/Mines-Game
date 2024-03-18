var mysql = require('mysql');

var con = mysql.createConnection({             // Create mysql connection 
    host: "localhost",                         // Change the field values accordingly 
    user: "root",
    password: "Fa*mysql12345",
    database: "minesDB"
});

con.connect(function(err) {
    if (err) throw err;
    //console.log("Connected!");
    
    // Sql command to create table
    var sql = "CREATE TABLE gameStats (players VARCHAR(50), result VARCHAR(50), gameStates VARCHAR(1000), actualBoard VARCHAR(100))";
    con.query(sql, function (err, result) 
    {
        if (err) throw err;
        console.log("Table created\n");
    });
    con.end((error) => {
        if (error) {
            console.error('Error! closing MySQL connection:', error);
            return;
        }
    });
});
