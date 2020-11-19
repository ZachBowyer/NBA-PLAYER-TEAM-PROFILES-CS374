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
let db = new sqlite3.Database('./DBFILES/NBA_Stats_OFFV2.db', sqlite3.OPEN_READWRITE, (err) => {
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

//var fs = require('fs');
//var files = fs.readdirSync('../NBA-PLAYER-TEAM-PROFILES-CS374');
//console.log(files);

//Sends files to client
app.get('/', function(req, res){
   res.sendFile(path.join(__dirname + '/index.html'));
   console.log("Sending index.html to client")
});

FileGetRequest('index.js')
FileGetRequest('index.css')
FileGetRequest('jquery-3.5.1.js')
FileGetRequest('playerInfo.html')
FileGetRequest('playerInfo.css')
FileGetRequest('playerInfo.js')
FileGetRequest('TeamInfo.html')
FileGetRequest('TeamInfo.css')
FileGetRequest('TeamInfo.js')
FileGetRequest('tabulator.min.css')
FileGetRequest('tabulator.min.js')
FileGetRequest('Chart.min.js')
FileGetRequest('AllPlayers.html')
FileGetRequest('AllTeams.html')
FileGetRequest('Downloads.html')
FileGetRequest('Downloads.css')

FileGetRequest('DB_Creation/PlayerTotals.csv')
FileGetRequest('DB_Creation/Salaries.csv')
FileGetRequest('DB_Creation/shots-2019.csv')
FileGetRequest('DB_Creation/TeamOppTotals.csv')
FileGetRequest('DB_Creation/TeamTotals.csv')
FileGetRequest('DBFILES/NBA_Stats_Official.db')

app.get('/Downloads.html', function(req, res){
   res.sendFile(path.join(__dirname + '/Downloads.htmll'));
   console.log("Sending Downloads.html to client")
});

//Sends files to client given name
function FileGetRequest(FileName)
{
  app.get('/' + FileName, function(req, res){
  res.sendFile(path.join(__dirname + '/' + FileName));
  console.log("Sending " + FileName + " to client")
  });
}