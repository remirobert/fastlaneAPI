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

var listQueue = new Array();

User.find({}, function(err, users) {
  users.forEach(function(currentUser) {
     listQueue.push(currentUser);
  });
  
  users.forEach(function(currentUser) {
     listQueue.push(currentUser);
  });
  users.forEach(function(currentUser) {
     listQueue.push(currentUser);
  });
  console.log(listQueue);
})

function findUser(user) {
    for (var index = 0; index < listQueue.length; index++) {
      var currentUser = listQueue[index];
      if (currentUser.phone === user.phone) {
        return index;
      }
    }
   return -1;
}

function sendMessage(to, content) {
  console.log("send message to : " + to);
  twilio.sendSms({
    to:to,
    from:'+33644600833',
    body:content
  }, function(error, message) {
    if (!error) {
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
        console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
        console.log('Oops! There was an error. : ');
        console.log(error);
    }
  });
}

function interpretCommand(command, user) {
    var contents = new Array();
    console.log("interpret command");
    
    switch (command) {
    case "hello":
      var currentIndexFind = findUser(user);
      if (currentIndexFind != -1) {
         var content = "Vous êtes déjà dans la liste d'attente à la position " + currentIndexFind + ".";
         contents.push(content);
      }
      else {
        listQueue.push(user);
        var currentPosInQueue = listQueue.length;
        var content = "Bienvenue sur Fastlne, vous êtes le numéro " + currentPosInQueue + " dans la file d’attente. Vous serez prévenu par sms dès que ce sera à votre tour de passer en caisse";
        contents.push(content);
      }   
      break;
  
    case "status":
      content = ""
      var positionQueue = findUser(user);
      if (positionQueue == -1) {
         var content = "Vous n'êtes actuellement pas dans la liste d'attente. Envoyez hello pour entrer dans la fille d'attente.";
         contents.push(content);
      }
      else {
        var content = "Vous êtes en position " + positionQueue + " dans la file d'attente.";
        contents.push(content);        
      }
      break;
      
    case "quit":
      var positionQueue = findUser(user);
      if (positionQueue == -1) {
         var content = "Vous n'êtes actuellement pas dans la liste d'attente. Envoyez hello pour entrer dans la fille d'attente.";
         contents.push(content);
      }
      else  {
        listQueue.splice(positionQueue, 1);
        var content = "Nous avons bien pris en compte votre retrait de la file d’attente";
        contents.push(content);
      }
      break; 
          
    default:
    case "help":
      console.log("commande help");
      
      var content = "Envoyer:"
      content += "\nhelp:pour obtenir de l’aide"
      content += "\nhello:pour entrer dans la file d’attente"
      content += "\nstatus:pour connaitre votre position"
      content += "\nquit:pour sortir de la file"
      contents.push(content);
      break;
  }
  for (var index = 0; index < contents.length; index++) {
    sendMessage(user.phone, contents[index]);        
  }
}

app.get('/sms', function (req, res) {
  console.log("------------ [RECEIVED MESSAGE] -------");
  var phoneNumber = req.query.From;
  var command = req.query.Body.toUpperCase().toLowerCase();  
   
  console.log("phone number : " + phoneNumber);
  console.log("command : " + command);
   
  console.log(listQueue);
   
  User.findOne({phone:phoneNumber}, function(err, obj) {
      if (err) {
        console.log("error" + err);
        res.send("error");
        return;
      }
      if (obj) {
        console.log("Get user");
        interpretCommand(command, obj);
      }
      else {
        var newUser = User();
        newUser.phone = phoneNumber;
        newUser.save(function(err) {
          if (!err) {
            console.log("Create new user");
            interpretCommand(command, newUser);
          }
        });
      }
  });
  res.send('Hello World!');                    
});

app.get('/customers', function(req, res) {
  var customers = new Array();
  listQueue.forEach(function(currentCustomer) {
    customers.push(JSON.stringify(currentCustomer));
  });      
  res.send(customers);  
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
