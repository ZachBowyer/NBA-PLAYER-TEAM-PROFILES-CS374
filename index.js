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
    $("#Results").empty();
    let data = SQLPostRequest("SELECT * from PlayerTotals WHERE PlayerName LIKE '" + userInput.value + "%'");
    console.log("high level", data);

    //add to list
    for(var i = 0; i < data.length; i++)
    {
        //$("#Results").append('<li style: position:absolute><p>' + data[i].PlayerName + '<p><li>');
        $("#Results").append('<li>' + data[i].PlayerName + '<li>');
        $('#Results li:last-child').remove();
        //var li = document.createElement('li');
        //var li = document.createElement('li');
        //li.innerHTML = '<li>' + data[i].PlayerName + '<li>';
        //document.getElementById("Results").appendChild(li)
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
    
    /*
    $.post(Url, data, function(ReturnedData, status)
    {
        console.log(ReturnedData)
    })
    */

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
