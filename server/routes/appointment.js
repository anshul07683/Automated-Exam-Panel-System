var express = require('express');
var con = require('./connection');
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');
var app = express();
var async = require('async');

noFileExists = 0;
var message = '';

app.get('/generate',function(req,res,next){
   
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
            console.log(req.query.codes);
            sql = "select e.name, e.exam_code, s.nomenclature, e.department, e.address FROM examiners as e join subjects as s on e.Subject_Code = s.Code where exam_code IN (?)";
            con.query(sql, [req.query.codes], (err, result, fields) => {
                if(err) return res.send('Server Error');
               console.log(result);


                async.forEach(result, function(item, callback){
                    data = {
                        name: item.name,
                        code: item.exam_code,
                        nomenclature: item.nomenclature,
                        dept: item.department,
                        address: item.address
                    }
                    // console.log(data);
                    generateLetter(data);
                    console.log('file is processed');
                    callback();
                },
                function(err){
                    conn.release();
                    return res.send(200,{body:'Generating Proposal Letters, Please Check Output Directory'});
                }
            );
               
            });
        }
    });
});


function generateLetter(data, i){
        //Load the docx file as a binary
var content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

var zip = new JSZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

doc.setData(data);

try {
// render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
doc.render()
}
catch (error) {
var e = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    properties: error.properties,
}
// console.log(JSON.stringify({error: e}));
// The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
message = e.message;
return;
}

var buf = doc.getZip().generate({type: 'nodebuffer'});
var filePath = path.resolve(__dirname+"/Output/", "Allotment_"+data.name+'.docx');
// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
fs.stat(filePath, function(err, stat) {
    if(err == null) {
        noFileExists++;
        console.log(noFileExists+" "+ filePath+ ' Exists');
    } else if(err.code == 'ENOENT') {
        // file does not exist
        fs.writeFileSync(filePath, buf);
    } else {
        message = 'Server Error';
        // console.log('Some other error: ', err.code);
    }
});
}
module.exports = app;