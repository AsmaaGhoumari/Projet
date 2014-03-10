var express = require('express'),
util = require('util');

var app = express();

app.get('/', function(req, res){
 res.sendfile('index.html');
})
.get('/inscription',function(req,res){
       res.sendfile('site/inscription.html');
})
.get('/missions',function(req,res){
       res.sendfile('site/missions.html');
})
.get('/contact',function(req,res){
       res.sendfile('site/nousContactez.html');
})
.get('/don',function(req,res){
       res.sendfile('site/nousSoutenir.html');
})
.get('/redac',function(req,res){
       res.sendfile('site/redac.html');
})
.get('/philosophie',function(req,res){
       res.sendfile('site/philosophie.html');
});

app.listen(1337);
util.log('Server running at http://127.0.0.1:1337/');
