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
        var content1 = "Bienvenue sur Fastlne, le service de gestion des files d'attente par SMS.";
        var content2 = " Vous êtes le numéro " + currentPosInQueue + " dans la file d'attente.";
        var content3 = " Vous serez prévenu par sms dés que ce sera à votre tour de passer en caisse.";
        contents.push(content1);
        contents.push(content2);        
        contents.push(content3);                
      }   
      break;
  
    case "status":
      content = ""
      var positionQueue = findUser(user);
      if (positionQueue == -1) {
         var content = "Vous n'êtes actuellement pas dans la liste d'attente. Envoyez << hello >> pour entrer dans la fille d'attente.";
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
         var content = "Vous n'êtes actuellement pas dans la liste d'attente. Envoyez << hello >> pour entrer dans la fille d'attente.";
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
      var content1 = "help - envoyer help pour obtenirde l'aide sur le fonctionnement du service."
      var content2 = "\nhello - envoyer hello pour entrer dans la fille d'attente.";
      var content3 = "\nstatus - envoyer status pour connaitre votre position dans la fille d'attente.";
      var content4 = "\nquit - envoyer quit pour sortir de la file d'attente.";
      contents.push(content1);
      contents.push(content2);
      contents.push(content3);
      contents.push(content4);
      break;
  }
  if (content) {
    console.log("content : " + content);
    sendMessage(user.phone, content);    
  }
}

function sendWelcomeUser(user) {
  var content1 = "Bienvenue sur Fastlne, le service de gestion des files d'attente par SMS.";
  var content2 = "Voici le descriptif des principales commandes:";
  var content3 = "\n\nhelp - envoyer <<help>> pour obtenirde l'aide sur le fonctionnement du service.";
  var content4 = "\n\nhello - envoyer <<hello>> pour entrer dans la fille d'attente.";
  var content5 = "\n\nstatus - envoyer <<status>> pour connaitre votre position dans la fille d'attente.";
  var content6 = "\n\nquit - envoyer <<quit>> pour sortir de la file d'attente.";
  sendMessage(user.phone, content1);
  sendMessage(user.phone, content2);
  sendMessage(user.phone, content3);
  sendMessage(user.phone, content4);
  sendMessage(user.phone, content5);
  sendMessage(user.phone, content6);
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
            sendWelcomeUser();
            interpretCommand(command, newUser);
          }
        });
      }
  });
  res.send('Hello World!');                    
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
