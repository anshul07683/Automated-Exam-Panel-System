var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "examdept"
});

pool.getConnection(function(err) {  
    if (err) {
        console.log("Error Connecting to Database");
        return
    }   
    else {
        console.log("Connected!"); 
    }
  });  

  module.exports = pool;