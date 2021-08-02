var express = require("express");
var department = express.Router();
var mysql = require("mysql");
var con = require("./connection");

department.post("/add_department", (req, res, next) => {
    // console.log(req.body);
    con.getConnection(function(err,conn){
      if(err){
        return next(err);
      }
      else{
        conn.query("INSERT INTO departments SET ?", req.body, function(
          err,
          result,
          fields
        ) {
          if (err) {
              return res.send({status:false,message:"Server Error"});
            }
          else {
            conn.release();
            return res.send({status:true,message:"Department Details Added Succefully"});
          }
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


  department.post("/upload_file", (req, res, next) => {

    con.getConnection(function(err, conn){
      if(err){
        return next(err);
      }
      else{
        var data = ObjToArray(req.body);

      conn.query("INSERT INTO departments (dept_code, dept_name, start, end) VALUES ? ON DUPLICATE KEY UPDATE dept_code=dept_code", [data], function(
        err,
        result
      ) {
        if (err){
          console.log(err);
          if(err.errno = 1136){
            return res.send({status: false, message:"Column count doesn't match value count Or Null Value"});
          }
        }
       else{
        conn.release();
        return res.send({status: true, message:"File Uploaded Successfully"});
        }
      });
        }
      });
  });

  department.get("/get_departments", (req, res, next) => {
    con.getConnection(function(err, conn){
      if(err){
        return next(err);
      }
      else{
        conn.query("SELECT * FROM departments", function(err, result, fields) {
          if (err) return next(err);
          conn.release();
          return res.send(result);
        });
      }
    });
    });


    department.get("/get_department/:ex_name", (req, res, next) => {
      con.getConnection(function(err, conn){
        if(err){
          return next(err);
        }
        else{
          var ex_name = req.params.ex_name;
          conn.query("SELECT department FROM examiners where name = ?", ex_name , function(err, result, fields) {
            if (err) return next(err);
            conn.release();
            return res.send(result);
          });
        }
      });
      });


    department.post("/update_range", (req, res, next) => {
      con.getConnection(function(err, conn){
        if(err){
          return next(err);
        }
        else{
          var dc = req.body.dept_code;
          var data = {
            start: req.body.start,
            end: req.body.end
          }

          conn.query("UPDATE departments SET ? where dept_code = '"+dc+"'", data, function(
            err,
            result,
            fields
          ) {
            if(err) return next(err);
            conn.release();
            return res.send(req.body);
          });
        }
      });
    });
  
    department.delete("/delete_department/:code", (req, res, next) => {
        con.getConnection(function(err, conn){
          if(err){
            return next(err);
          }
          else{
             // console.log(req.params.code);
        conn.query(
          "delete from departments where dept_code = ? ",
          req.params.code,
          (err, result) => {
            if (err) return next(err);
            conn.release();
            return res.send(result);
          }
        );
          }
        });
    });

        department.delete("/delete_all", (req, res, next) => {
            con.getConnection(function(err,conn){
              if(err){
                return next(err);
              }
              else{
                conn.query(
                  "delete from departments",
                  req.params.id,
                  (err, result) => {
                    if(err){
                        return res.send({status: false, message:"Server Error"});
                    }else{
                    conn.release();
                    return res.send({status:true,data:result,message:"All Department Details Are Deleted Successfully"});
                    }
                  }
                );
              }
            });
          });
          
module.exports = department;