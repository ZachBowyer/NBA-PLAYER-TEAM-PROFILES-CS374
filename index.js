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
    console.log(userInput.value)
}


//Makes a post request to server
//Expects a string argument
//Will be used for SQL statements
//This should never be used for sensitive data
//Due to the nature of this app, SQL will be handled client-side
function SQLPostRequest(SQLString)
{
    const Url = 'http://localhost:3000';
    const data = {
        Command: SQLString
    }
    $.post(Url, data, function(data,status){
        console.log(data)
    })
}

SQLPostRequest("SELECT * from PlayerTotals");