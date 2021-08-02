var express = require("express");
var paperRecieved = express.Router();
var mysql = require("mysql");
var con = require("./connection");

paperRecieved.post("/updateStatus", (req, res, next) => {
    con.getConnection(function(err, conn){
        if(err){
            return next(err);
        }
        else{
            conn.query('update paper_status SET ? where exam_code = '+req.body.exam_code,req.body, function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send(req.body);
            });
        }
    });
    
});

paperRecieved.get("/getStatus", (req, res, next) => {
    con.getConnection(function(err, conn){
        if(err){
            return next(err);
        }
        else{
            conn.query('Select * from paper_status', function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send(results);
            });
        }
    });
    
});

paperRecieved.post("/addStatus", (req, res, next) => {
    con.getConnection(function(err, conn){
        if(err){
            return next(err);
        }
        else{
            console.log(req.body);
          
            var data = {
                exam_code: req.body.exam_code,
                examiner: req.body.name,
            }
            // Start coding from here
            
            conn.query('insert into paper_status SET ?',data, function(error, results, fields){
                  if (error){
                        return next(error);
                  } 
                  conn.release();
                  return res.send(results);
              });
        }
    });
    
});

paperRecieved.post("/addAllotedToStatus", (req, res, next) => {
    con.getConnection(function(err, conn){
        if(err){
            return next(err);
        }
        else{
            console.log(req.body);
          
            var data = ObjToArray(req.body);
            console.log(data);
            // Start coding from here
            
            conn.query('insert into paper_status(exam_code, examiner) values ?',[data], function(error, results, fields){
                  if (error){
                        return next(error);
                  } 
                  conn.release();
                  return res.send(results);
              });
        }
    });
    
});

function ObjToArray(obj) {
    var arr = obj instanceof Array;
    return (arr ? obj : Object.keys(obj)).map(function(i) {
      var val = arr ? i : obj[i];
      if(typeof val === 'object')
        return ObjToArray(val);
      else
        return val;
    });
  }

module.exports = paperRecieved;