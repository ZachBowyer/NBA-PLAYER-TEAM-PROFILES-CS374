//Search bar
let userInput = document.getElementById("UserSearch")
userInput.addEventListener('input', displayUserInput)
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
        if(data[i].Name.includes("\\"))
        {
            $("#ResultsDiv").append('<li onclick = "detectIfPlayerOrTeam($(this).text());">' + data[i].Name.split("\\")[0]);
        }
        else
        {
            $("#ResultsDiv").append('<li onclick = detectIfPlayerOrTeam($(this).text());>' + data[i].Name);
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

function goToPlayerPage(playerName)
{
    console.log("Its a player")
    console.log(playerName);
    $.get( "/playerInfo.html", function( data ) {
    $( ".result" ).html( data );
    window.location.href = "/playerInfo.html"
});
}

function goToTeamPage(teamName)
{
    console.log("Its a team")
    console.log(teamName);
    $.get( "/TeamInfo.html", function( data ) {
    $( ".result" ).html( data );
    window.location.href = "/TeamInfo.html"
});
}

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


