var express = require("express");
var subjects = express.Router();
var mysql = require("mysql");
var con = require("./connection");

subjects.post("/add_subject", (req, res, next) => {
    // console.log(req.body);
    con.getConnection(function(err,conn){
      if(err){
        return next(err);
      }
      else{
        conn.query("INSERT INTO subjects SET ?", req.body, function(
          err,
          result,
          fields
        ) {
          if (err) {
              return res.send({status:false,message:"Server Error"});
            }
          else {
            conn.release();
            return res.send({status:true,message:"Subject Code Added Succefully"});
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

  subjects.post("/upload_file", (req, res, next) => {

    con.getConnection(function(err, conn){
      if(err){
        return next(err);
      }
      else{
        var data = ObjToArray(req.body);

      conn.query("INSERT INTO subjects (Code, Nomenclature, group_id) VALUES ? ON DUPLICATE KEY UPDATE Code=Code", [data], function(
        err,
        result
      ) {
        if (err){
          // console.log(err);
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


subjects.get("/get_subjects", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      conn.query("SELECT * FROM subjects", function(err, result, fields) {
        if (err) return next(err);
        conn.release();
        // console.log(result);
        return res.send(result);
      });
    }
  });
  });

  subjects.get("/get_group/:code", (req, res, next) => {
    var sc = '';
    con.getConnection(function(err, conn){
      if(err){
        return next(err);
      }
      else{
        // console.log(req.params.code);

        conn.query('select subject_code from examiners where exam_code = ?', req.params.code,(err,results,fields)=>{
          if(err) return next(err);
          sc = results[0].subject_code;
        

        // console.log(sc);
        conn.query('Select group_id from subjects where Code = ?',sc,(err,results,fields)=>{
          if(err) return next(err);
          console.log(results);
          if(results == []){
            return res.send({status: false, message:'Error while fetching group_id'});
          }
          else{
            var gid = results[0].group_id;
          // console.log(gid);
          if(gid > 0){
            conn.query("SELECT Code from subjects where group_id = ?",gid, function(err, results, fields) {
              if (err) return next(err);
              conn.release();
              return res.send(results);
          });
          }
          else{
            conn.query("SELECT Code from subjects where Code=?",sc,(err, results, fields)=>{
              if (err) return next(err);
              conn.release();
              console.log(results);
              return res.send(results);
            });
          }
        }
        });
      });
      }
    });
      
    });
  
  subjects.delete("/delete_subject/:code", (req, res, next) => {
    con.getConnection(function(err, conn){
      if(err){
        return next(err);
      }
      else{
         // console.log(req.params.code);
    conn.query(
      "delete from subjects where Code = ? ",
      req.params.code,
      (err, result) => {
        if (err) return next(err);
        conn.release();
        return res.send(result);
      }
    );
      }
    })
   
  });

  subjects.delete("/delete_all", (req, res, next) => {
    con.getConnection(function(err,conn){
      if(err){
        return next(err);
      }
      else{
        conn.query(
          "delete from subjects",
          req.params.id,
          (err, result) => {
            if(err){
              if(err.errno == 1701){
                conn.release();
                return res.send({status: false, message:"Subject Codes are referenced by Examiner's subject code, Please delete examiner table first"});
              }
            }else{
            conn.release();
            return res.send({status:true,data:result,message:"All Subject Details Are Deleted Successfully"});
            }
          }
        );
      }
    });
   
  });
  


module.exports = subjects;
