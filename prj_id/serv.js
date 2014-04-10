var util= require('util');//importation de la bibliothèque util dans la variable util

var express = require('express');
var app = express();//create server qu'on met dans la variable app
var fs=require('fs');


app.get('/', function(req, res){ // attends une requete qui attends un '/' pour renvoyer Hello world 
	res.sendfile('index.html');//on envoie le fichier index
});

app.use(express.static('C:/Users/Utilisateurs/Public'));
app.listen(1337); //on ecoute sur le port 1337
util.log('Server running at http://127.0.0.1:1337/');//affiche sur la console 