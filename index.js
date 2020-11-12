//Search bar
let userInput = document.getElementById("UserSearch")
userInput.addEventListener('input', displayUserInput)


//Makes a post request to server
//Expects a string argument
//Will be used for SQL statements
//This should never be used for sensitive data
//Due to the nature of this app, SQL will be handled client-side
function SQLPostRequest(SQLString)
{
    const PageUrl = 'http://localhost:3000';
    const data_ = { Command: SQLString }
    let result = 0;
    $.ajax({
    type: 'POST',
    url: PageUrl,
    data: data_,
    success: function(Data) { result = Data},
    async:false //bad for large data
    });
    return result;
}


function displayUserInput()
{
    $("#ResultsDiv").empty();
    let data = SQLPostRequest('SELECT DISTINCT Name FROM (SELECT DISTINCT PlayerName AS Name From PlayerTotals UNION Select DISTINCT TeamName AS Name from TeamTotals) WHERE Name LIKE "' + userInput.value + '%"');

    //add to list
    for(var i = 0; i < 8; i++)
    {
        if(i == data.length)
        {
            break;
        }
        if(data[i].Name.includes("\\")) //if its a player
        {
            $("#ResultsDiv").append('<li onclick = "detectIfPlayerOrTeam($(this).text());">' + data[i].Name.split("\\")[0]);
            //let PlayerPictureURL = "https://www.basketball-reference.com/req/202011101/images/players/" + data[i].Name.split("\\")[1] + ".jpg"
            $("#ResultsDiv").append('<img itemscope="image" src = ' + getPlayerPictureFromName(data[i].Name) + ' width = 10%></img>')
        }
        else    //if its a team
        {
            $("#ResultsDiv").append('<li onclick = detectIfPlayerOrTeam($(this).text());>' + data[i].Name);
            $("#ResultsDiv").append('<img class="teamlogo" itemscope="image" src= ' + getTeamPicutureFromName(data[i].Name) +' width = 10%></img>')
        }
    }
    if(userInput.value == "")
    {
        $("#ResultsDiv").empty();
    }
}

function detectIfPlayerOrTeam(NameString)
{
    let Playerdata = SQLPostRequest('SELECT DISTINCT PlayerName FROM PlayerTotals WHERE PlayerName LIKE "' + NameString + '%"');
    let Teamdata = SQLPostRequest('SELECT DISTINCT TeamName FROM TeamTotals WHERE TeamName LIKE "' + NameString + '%"');
    if(Playerdata.length > 0)
    {
        goToPlayerPage(NameString)
    }
    else if(Teamdata.length > 0)
    {
        goToTeamPage(NameString)
    }
}

//Get player/team urls given the names of the players/teams
function getPlayerPictureFromName(playerName)
{
    let fullPlayerName = SQLPostRequest('SELECT DISTINCT PlayerName FROM PlayerTotals WHERE PlayerName LIKE "' + playerName + '%"');
    let playerSearchString = fullPlayerName[0].PlayerName.split("\\")[1]
    return "https://www.basketball-reference.com/req/202011101/images/players/" + playerSearchString + ".jpg"

}

function getTeamPicutureFromName(teamName)
{
    let teamAbbreviation = SQLPostRequest('SELECT DISTINCT Abbr FROM TeamTotals WHERE TeamName LIKE "' + teamName + '%"');
    return "https://d2p3bygnnzw9w3.cloudfront.net/req/202010221/tlogo/bbr/" + teamAbbreviation[0].Abbr + ".png"
}

function createPlayerSearchString(playerName)
{
    let searchString = "";
    let firstname =  playerName.split(" ")[0]
    let lastname =  playerName.split(" ")[1]
    searchString = (lastname.slice(0,5) + firstname.slice(0,2) + "01");
    searchString = searchString.toLowerCase()
    return searchString;
}


//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//Player html relevant js
function goToPlayerPage(playerName)
{
    $.get( "/playerInfo.html", function( data ) {
    $( ".result" ).html( data );
    window.location.href = "/playerInfo.html#" + playerName
    setTimeout(function(){
        location.reload()
    }, 40)
    });
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//Team html relevant js
function goToTeamPage(teamName)
{
    $.get( "/TeamInfo.html", function( data ) {
    $( ".result" ).html( data );
    window.location.href = "/TeamInfo.html#" + teamName
    setTimeout(function(){
        location.reload()
    }, 40)
});
}
