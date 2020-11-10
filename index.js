//Takes client to different html page
function testFunction()
{
    console.log("testFunction activated")
    window.location.href = "http://127.0.0.1:5500/Test.html";
}

//Search bar
let userInput = document.getElementById("UserSearch")
userInput.addEventListener('input', displayUserInput)
function displayUserInput()
{
    
    $("#ResultsDiv").empty();
    let data = SQLPostRequest("SELECT DISTINCT Name FROM (SELECT DISTINCT PlayerName AS Name From PlayerTotals UNION Select DISTINCT TeamName AS Name from TeamTotals) WHERE Name LIKE '" + userInput.value + "%'");

    //add to list
    for(var i = 0; i < 8; i++)
    {
        if(i == data.length)
        {
            break;
        }
        if(data[i].Name.includes("\\"))
        {
            $("#ResultsDiv").append('<li>' + data[i].Name.split("\\")[0]);
        }
        else
        {
            $("#ResultsDiv").append('<li>' + data[i].Name);
        }
    }
    if(userInput.value == "")
    {
        $("#ResultsDiv").empty();
    }
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
