var config = require('config.json')('./config.json');
var app = require('express')();
var User = require('./models/User.js');
var twilio = require('twilio')('ACd9ca0c5ad3177148707f2be7593fc068', 'd381167bf4cfec68df4166c0e97dd666');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("database opened");
});

app.get('/', function (req, res) {
  
  var newUser = User();
  newUser.phone = "8323243";
  
  newUser.save();
  res.send('Hello World!');  
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
