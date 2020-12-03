//ExpressJS server setup
var express = require('express');
var app = express();
app.listen(3000);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var path = require("path")
var fs = require('fs');

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//SQLITE3

//Connect to SQLITE3 database file
//Open it for reading or writing
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./User_downloadables/DBFILES/NBA_Stats_V3.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//HTTP REQUESTS

//If client makes POST request to root url
//Client request is a SQL string
//server will run sql statement via sqlite 
//and will return data as json to client
app.post('/', function (req, res) 
{
  //Receive request, set variable to received string
  console.log("POST request detected, received data: ", req.body)
  let SQLStatement = req.body.Command

  //Run SQL query in the database
  //Put results into data array
  var data = []
  db.each(SQLStatement, function(err, row)
  {
    if (err) {console.error(err.message)}
    data.push(row)
  },function() {res.send(data)}); //Once data is retreived from the SQLITE3 query, send data to client
})

//Make it possible for the server to accept get requests for all files in the directory
createGetRequestsForProjectFiles(__dirname + "/User_downloadables");

//Request to root directory ("localhost:3000") will send index.html
app.get('/', function(req, res){
   res.sendFile(path.join(__dirname + '/User_downloadables/HTML_FILES/index.html'));
});

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//Functions

//Given directory, creates get requests for all files
//In and below the root
//Recursive
function createGetRequestsForProjectFiles(FilePath)
{
  var files = fs.readdirSync(FilePath);
  for(var i = 0; i < files.length; i++)
  {
    if(checkIfDir(files[i])) { createGetRequestsForProjectFiles(FilePath + "/" + files[i]) }
    FileGetRequest(FilePath + "/" + files[i])
  }
}

//Given the FilePath 
//Automatically creates a get request to file URL
function FileGetRequest(FileName)
{
  app.get(FileName.split(__dirname)[1], function(req, res){
    res.sendFile(FileName);
  });
}

//Checks a string to see if it has a '.' in it
//If it has a '.' it is not a folder
function checkIfDir(Name) { return !(Name.includes(".")) }