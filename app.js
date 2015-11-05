var config = require('config.json')('./config.json');
var app = require('express')();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
