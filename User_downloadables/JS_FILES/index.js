//Makes a post request to server
//Expects a string argument
//Will be used for SQL statements
//This should never be used for any application with sensitive data
//Very vunerable to SQL injections
//Due to the nature of this app (class project), SQL will be handled client-side
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

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//Event listeners

//Detects when input is entered into the search bar
//Once input is detected, will attempt to
//suggest results that should be clicked on
//If result is clicked, user will be taken to corresponding player/team page
let userInput = document.getElementById("UserSearch")
userInput.addEventListener('input', displayUserInput)
function displayUserInput()
{
    //Clear suggestions before attempting to append more
    $("#ResultsDiv").empty();

    //Get suggested results via query
    let data = SQLPostRequest('SELECT DISTINCT Name FROM (SELECT DISTINCT PlayerName AS Name From PlayerTotals UNION Select DISTINCT TeamName AS Name from TeamTotals) WHERE Name LIKE "' + userInput.value + '%"');

    //Once suggested results are retreived, display 12 of them
    for(var i = 0; (i < 12 && i < data.length); i++)
    {
        //Exception
        if (data[i].Name == "League Average") {return}

        //If data is a player, go to player page
        //Or if data is a team, go to the team page
        if(data[i].Name.includes("\\")) { $("#ResultsDiv").append('<li onclick = "goToPage($(this).text());">' + data[i].Name.split("\\")[0]); }
        else { $("#ResultsDiv").append('<li onclick = goToPage($(this).text());>' + data[i].Name); }
    }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//Player and team pictures

//Given the name of a player,
//return url of their profile picture
function getPlayerPictureFromName(playerName)
{
    let fullPlayerName = SQLPostRequest('SELECT DISTINCT PlayerName FROM PlayerTotals WHERE PlayerName LIKE "' + playerName + '%"');
    let playerSearchString = fullPlayerName[0].PlayerName.split("\\")[1]
    return "https://www.basketball-reference.com/req/202011101/images/players/" + playerSearchString + ".jpg"
}

//Given the name of a team, 
//return url of its profile picture
function getTeamPictureFromName(teamName)
{
    //Get team abbreviation from name via SQL
    let teamAbbreviation = SQLPostRequest('SELECT DISTINCT Abbr FROM TeamTotals WHERE TeamName LIKE "' + teamName + '%"');

    //exceptions
    if(teamAbbreviation[0].Abbr == "NOP") { console.log(123); teamAbbreviation[0].Abbr = "NOH" }
    if(teamAbbreviation[0].Abbr == "BRK") { console.log(123); teamAbbreviation[0].Abbr = "NJN" }
    if(teamAbbreviation[0].Abbr == "CHO") { console.log(123); teamAbbreviation[0].Abbr = "CHA" }

    //return constructed URL
    return "https://d2p3bygnnzw9w3.cloudfront.net/req/202010221/tlogo/bbr/" + teamAbbreviation[0].Abbr + ".png"
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////Functions that change the url of the page

//Will change window location to
//http://localhost:3000/User_downloadables/HTML_FILES/AllPlayers.html
function goToAllPlayersPage()
{
    $.get( "/User_downloadables/HTML_FILES/AllPlayers.html", function( data ) {
    $( ".result" ).html( data );
    window.location.href = "/User_downloadables/HTML_FILES/AllPlayers.html";
    setTimeout(function(){
        location.reload()
    }, 40)
    });
}

//Will change window location to
//http://localhost:3000/User_downloadables/HTML_FILES/AllTeams.html
function goToAllTeamsPage()
{
    $.get( "/User_downloadables/HTML_FILES/AllTeams.html", function( data ) {
    $( ".result" ).html( data );
    window.location.href = "/User_downloadables/HTML_FILES/AllTeams.html";
    setTimeout(function(){
        location.reload()
    }, 40)
    });
}

//Will change window location to
//http://localhost:3000/User_downloadables/HTML_FILES/Downloads.html
function goToDownloadPage()
{
    $.get( "/User_downloadables/HTML_FILES/Downloads.html", function( data ) {
    $( ".result" ).html( data );
    window.location.href = "/User_downloadables/HTML_FILES/Downloads.html";
    setTimeout(function(){
        location.reload()
    }, 40)
    });
}

//Goes back to root page url
function goToHomePage() { window.location.href = "/"; }

//Given the name of a player or team,
//Changes window to playerInfo.html if a player is detected
//Changes window to teamInfo.html if a team is detected
//Uses returned player from query to create the correct url of the player
function goToPage(NameString)
{
    let Playerdata = SQLPostRequest('SELECT DISTINCT PlayerName FROM PlayerTotals WHERE PlayerName LIKE "' + NameString + '%"');
    let Teamdata = SQLPostRequest('SELECT DISTINCT TeamName FROM TeamTotals WHERE TeamName LIKE "' + NameString + '%"');
    if(Playerdata.length > 0) { goToPlayerPage(NameString) }
    else if(Teamdata.length > 0) { goToTeamPage(NameString) }
    else {console.log("No data detected")}
}

//Given name of player
//Changes window location to playerInfo.html
//Puts player name into url after # character
//For example, if you were to go to "Lebron James" page, 
//The url would be:
//http://localhost:3000/User_downloadables/HTML_FILES/playerInfo.html#LeBron%20James
function goToPlayerPage(playerName)
{
    $.get( "/User_downloadables/HTML_FILES/playerInfo.html", function( data ) {
    $( ".result" ).html( data );
    window.location.href = "/User_downloadables/HTML_FILES/playerInfo.html#" + playerName
    setTimeout(function(){
        location.reload()
    }, 40)
    });
}

//Given name of team
//Changes window location to teamInfo.html
//Puts team name into url after # character
//For example, if you were to go to "Detroit Pistons" page, 
//The url would be:
//http://localhost:3000/User_downloadables/HTML_FILES/TeamInfo.html#Detroit%20Pistons
function goToTeamPage(teamName)
{
    $.get( "/User_downloadables/HTML_FILES/TeamInfo.html", function( data ) {
    $( ".result" ).html( data );
    window.location.href = "/User_downloadables/HTML_FILES/TeamInfo.html#" + teamName
    setTimeout(function(){
        location.reload()
    }, 40)
});
}
