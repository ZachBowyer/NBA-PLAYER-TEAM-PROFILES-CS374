//ExpressJS server setup
var express = require('express');
var app = express();
var path = require("path")
app.listen(3000);

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

//SQLITE 3 setup
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./data/chinook.db', sqlite3.OPEN_READWRITE, (err) => {
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

//Data queries
db.each(`SELECT PlaylistId as id,
        Name as name
        FROM playlists`, (err, row) => {
  if (err) 
  {
    console.error(err.message);
  }
  console.log(row.id + "\t" + row.name);
});


//Close DB
CloseDB(db);

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

