var express = require("express");
var valuer = express.Router();
var mysql = require("mysql");
var con = require("./connection");

valuer.post('/add_valuer', (req, res, next) => {
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
            var data = {
                Exam_code : req.body.exam_code,
                subject_code : req.body.subject_code,
                Valuer_Name : req.body.valuer,
                Co_valuer_1 : req.body.name1 || null,
                Co_valuer_2 : req.body.name2 || null,
                Co_valuer_3 : req.body.name3 || null,
                Sent_Status : null,
                Recieved_Status: null
            }
            conn.query('Insert into paper_valuation SET ?',data, function(error, results, fields){
                if(err){
                    conn.release();
                    return res.send({status:false, message:"Error While Alloting"});
                  }
                  else{
                    conn.release();
                    return res.send({status:true, data:results, message:"Valuers Alloted Successfully"});
                  }
            });
        }
    });
});

valuer.post('/update_valuer', (req, res, next) => {
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
            var data = {
                Exam_code : req.body.exam_code,
                Sent_Status : req.body.sent || null,
                Recieved_Status: req.body.recieved || null
            }
            conn.query("update paper_valuation SET ? where Exam_Code = '"+data.Exam_code+"'",data, function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send({message: 'Successfully Inserted!!'});
            });
        }
    });
});

valuer.get("/get_all_valuers", (req, res, next) => {
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
            conn.query('Select * from paper_valuation', function(error, results, fields){
                if (error) return next(error);
                // console.log(results)
                conn.release();
                return res.send(results);
            });
        }
    });
});

valuer.delete('/delete_all', (req, res, next) => {
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
            conn.query('delete from paper_valuation', function(error, results, fields){
                if (error){
                    conn.release();
                    return res.send({status:false,message:"Error While Deleting"});
                }
                else{
                    conn.release();
                    return res.send({status:true, data:results, message:"All Alloted Details Deleted Successfully"});
                }
                
            });
        }
    });
});

valuer.delete("/delete_valuer/:exam_code", (req, res, next) => {
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
            var exam_code = req.params.exam_code;
            conn.query('delete from paper_valuation where Exam_Code = ?', exam_code , function(error, results, fields){
                if(err){
                    conn.release();
                    return res.send({status:false,message:"Error While Deleting"});
                  }
                  else{
                    conn.release();
                    return res.send({status:true, data:results, message:"Detail Deleted Successfully"});
                  }
            });
        }
    });
});

module.exports = valuer;