var express = require('express');
var app = express();
var path = require("path")

app.get('/', function(req, res){
   res.sendFile(path.join(__dirname + '/index.html'));
   console.log("Sending index.html to client")
});

app.get('/index.js', function(req, res){
       res.sendFile(path.join(__dirname + '/index.js'));
       console.log("Sending index.js to client")
});

app.get('/index.css', function(req, res){
    res.sendFile(path.join(__dirname + '/index.css'));
    console.log("Sending index.css to client")
});

app.listen(3000);