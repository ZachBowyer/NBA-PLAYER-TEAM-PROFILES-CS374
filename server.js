//ExpressJS server setup
var express = require('express');
var path = require("path")
const bodyParser = require('body-parser');
var app = express();
app.listen(3000);
app.use(bodyParser.urlencoded({ extended: true }));


//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

//SQLITE 3 setup
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./DBFILES/NBA_Stats_V3.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

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

//Make it possible for the server to accept get requests for all files in the directory
var fs = require('fs');
var files = fs.readdirSync('../NBA-PLAYER-TEAM-PROFILES-CS374');
for(var i = 0; i < files.length; i++)
{
  FileGetRequest(files[i])
}
files = fs.readdirSync('../NBA-PLAYER-TEAM-PROFILES-CS374/DB_Creation');
for(var i = 0; i < files.length; i++)
{
  FileGetRequest('DB_Creation/' + files[i])
}
FileGetRequest('DBFILES/NBA_Stats_V3.db')

//Sends initial files to client at root
app.get('/', function(req, res){
   res.sendFile(path.join(__dirname + '/index.html'));
   console.log("Sending index.html to client")
});

//Sends files to client given name
function FileGetRequest(FileName)
{
  app.get('/' + FileName, function(req, res){
    res.sendFile(path.join(__dirname + '/' + FileName));
    console.log("Sending " + FileName + " to client")
  });
}