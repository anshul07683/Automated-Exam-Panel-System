var express = require("express");
var paperSetter = express.Router();
var mysql = require("mysql");
var con = require("./connection");

paperSetter.post("/allot_paper_setter", (req, res, next) => {
    con.getConnection(function(err, conn){
        if(err){
            return next(err);
        }
        else{
            conn.query('Insert into paper_setter SET ?',req.body, function(error, results, fields){
                if(err){
                    conn.release();
                    return res.send({status:false, message:"Error While Alloting"});
                  }
                  else{
                    conn.release();
                    return res.send({status:true, data:results, message:"Paper Setter Alloted Successfully"});
                  }
            });
        }
    });
    
});

paperSetter.get("/get_alloted", (req, res, next) => {
    con.getConnection(function(err, conn){
        if(err){
            return next(err);
        }
        else{
            conn.query('Select * from paper_setter', function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send(results);
            });
        }
    });
    
});

paperSetter.delete("/delete_alloted/:exam_code", (req, res, next) => {
    con.getConnection(function(err, conn){
        if(err){
            return next(err);
        }
        else{
            var exam_code = req.params.exam_code;
            conn.query('delete from paper_setter where exam_code = ?', exam_code, function(error, results, fields){
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

paperSetter.delete('/delete_all', (req, res, next) => {
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
            conn.query('delete from paper_setter', function(error, results, fields){
                if (error){
                    conn.release();
                    return res.send({status:false,message:"Error While Deleting"});
                }
                else{
                    conn.release();
                    return res.send({status:true, data:results, message:"All Alloted PaperSetter Deleted Successfully"});
                }
                
            });
        }
    });
});


paperSetter.get('/get_examiner/:exam_code', (req, res, next) => {
    con.getConnection(function(err, conn){
        if(err){
            return next(err);
        }
        else{
            var exam_code = req.params.exam_code;
            conn.query('select name from examiners where exam_code = ?',exam_code, function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send(results);
            });
        }
    })
});
module.exports = paperSetter;