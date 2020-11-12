//ExpressJS server setup
var express = require('express');
var path = require("path")
const bodyParser = require('body-parser');

var app = express();
app.listen(3000);
app.use(bodyParser.urlencoded({ extended: true }));

//currently doing nothing
//const cors = require('cors')
//app.use(cors())



//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

//SQLITE 3 setup
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./DBFILES/NBA_Stats_Official.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

function CloseDB(DBConnectionVar)
{
    console.log("Closed DB connection", DBConnectionVar);
    DBConnectionVar.close();
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

//If client makes request to this
//client request is a SQL string
//server will run sql statement in via sqlite 
//and will return data as json to client


let invalidCharacters = ["\\", "'", "\""]

app.post('/', function (req, res) {
  console.log("POST request detected, received data: ", req.body)
  let SQLStatement = req.body.Command

  var data = []
  db.each(SQLStatement, function(err, row){
  if (err) 
  {
    console.error(err.message);
  }
  data.push(row)
  }, function(){
      console.log("Sending data to client");
      res.send(data)
  });
})

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

//Sends files to client
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

app.get('/jquery-3.5.1.js', function(req, res){
    res.sendFile(path.join(__dirname + '/jquery-3.5.1.js'));
    console.log("Sending jquery-3.5.1.js to client")
});

//Player html file sent to client
app.get('/playerInfo.html', function(req, res){
  res.sendFile(path.join(__dirname + '/playerInfo.html'))
  console.log("Sending playerInfo.html")
});

app.get('/playerInfo.css', function(req, res){
  res.sendFile(path.join(__dirname + '/playerInfo.css'))
  console.log("Sending playerInfo.css")
});

app.get('/playerInfo.js', function(req, res){
  res.sendFile(path.join(__dirname + '/playerInfo.js'))
  console.log("Sending playerInfo.js")
});

//Team html file sent to client
app.get('/TeamInfo.html', function(req, res){
  res.sendFile(path.join(__dirname + '/TeamInfo.html'))
  console.log("Sending playerInfo.html")
});

app.get('/TeamInfo.css', function(req, res){
  res.sendFile(path.join(__dirname + '/TeamInfo.css'))
  console.log("Sending playerInfo.css")
});

app.get('/TeamInfo.js', function(req, res){
  res.sendFile(path.join(__dirname + '/TeamInfo.js'))
  console.log("Sending playerInfo.js")
});