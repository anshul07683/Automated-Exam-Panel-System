var express = require("express");
var helmet = require('helmet');
var app = express();
var bodyParser = require("body-parser");
var examinerRoutes = require("./routes/examiners.js");
var subjectsRoutes = require("./routes/subjects.js");
var allotedRoutes = require("./routes/alloted.js");
var usersRoutes = require("./routes/users");
var valuerRoutes = require("./routes/valuer");
var departmentRoutes = require("./routes/department")
var paperRoutes = require('./routes/papers');
var paperSetterRoutes = require('./routes/paperSetter');
var appointment = require('./routes/appointment');
var notificationRoutes = require('./routes/notify');

var jsonParser       = bodyParser.json({limit:1024*1024*20, type:'application/json'});
var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding' })

app.use(helmet());
app.use(jsonParser);
app.use(express.urlencoded(urlencodedParser));

// allow-cors
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Accept");
  next();
});

app.use('/examiner', examinerRoutes);
app.use('/subject', subjectsRoutes);
app.use('/alloted', allotedRoutes);
app.use('/users', usersRoutes);
app.use('/papers', paperRoutes);
app.use('/paperSetter', paperSetterRoutes);
app.use('/appointment',appointment);
app.use('/valuer',valuerRoutes);
app.use('/department',departmentRoutes);
app.use('/notify', notificationRoutes)

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).send({
      status: false,
      message: err.message,
      error: err
  });
})

app.listen(3000, function() {
  console.log("Server is Running!! ");
});
