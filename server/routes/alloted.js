var express = require("express");
var alloted = express.Router();
var mysql = require("mysql");
var nodemailer = require("nodemailer");
var con = require("./connection");


alloted.post("/add_alloted", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }else{

      try{
        var data = ObjToArray(req.body);
      }
      catch(err){
        return next(err);
      }
     
      
      conn.query("INSERT INTO alloted_examiners (subject_code,examiner,type, exam_code) VALUES ?", [data], function(
        err,
        result,
        fields
      ) {
        if(err){
          console.log(err);
          return res.send({status:false, data:req.body, message:"Error While Alloting"});
        }
        conn.release();
        return res.send({status:true, data:result, message:"Examiner Alloted Successfully"});
      });
    }
  })
  
});

alloted.post("/update_alloted", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      console.log(req.body);
      var ec = req.body.exam_code;
      var data = {
        subject_code: req.body.subject_code,
        examiner: req.body.examiner,
        type: req.body.type,
        proposal: req.body.proposal,
        proposal_sent: req.body.proposal_sent,
        recieved_time: req.body.recieved_time,
        status: req.body.status
      }
      // console.log(req.body);
      conn.query("UPDATE alloted_examiners SET ? where exam_code = '"+ec+"'", data, function(
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


alloted.get("/get_alloted_list", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      conn.query("SELECT * FROM alloted_examiners", function(err, result, fields) {
        if(err) return next(err);
        conn.release();
        return res.send(result);
        
      });
    }
  });
});

alloted.delete("/delete_alloted/:id", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      console.log(req.params);
      conn.query(
        "delete from alloted_examiners where id = ? ",
        req.params.id,
        (err, result) => {  
          if(err){
            conn.release();
            return res.send({status:false,message:"Error While Deleting"});
          }
          else{
            conn.release();
            return res.send({status:true, data:result, message:"Detail Deleted Successfully"});
          }
        }
      );
    }
  });
 
});

alloted.get("/get_valuer/:vlcode",(req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      var code = req.params.vlcode;
      console.log(code);
      conn.query("select name, Subject_Code from examiners where exam_code = ?",code, (err, result) => {
        if(err) return next(err);
        conn.release();
        return res.send(result);
      });
    }
  })
});

alloted.get("/get_selected_email", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      //console.log(req.query.codes);
      var codes = req.query.codes;
      console.log(codes);
      conn.query(
        "select email from examiners where exam_code IN (?) ",
        [codes],
        (err, result) => {
          if(err) return next(err);
        conn.release();
        return res.send(result);
        }
      );
    }
  });
 
});

alloted.get("/get_subject_code_by_exam_code", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      //console.log(req.query.codes);
      var codes = req.query.codes;
      //console.log(codes);
      conn.query('select ')
      conn.query(
        "select subject_code from alloted_examiners where exam_code IN (?) ",
        [codes],
        (err, result) => {
          if(err) return next(err);
        conn.release();
        return res.send(result);
        }
      );
    }
  });
 
});



alloted.get("/exam_codes", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      conn.query(
        "select exam_code from alloted_examiners",
        (err, result) => {
          if(err) return next(err);
        conn.release();
        return res.send(result);
        } 
      );
    }
  });
 
});





alloted.delete("/delete_all", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      conn.query(
        "delete from alloted_examiners",
        (err, result) => {
          if(err){
            conn.release();
            return res.send({status:false,message:"Error While Deleting"});
          }
          else{
            conn.release();
            return res.send({status:true, data:result, message:"All Alloted Details Deleted Successfully"});
          }
        }
      );
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



module.exports = alloted;
