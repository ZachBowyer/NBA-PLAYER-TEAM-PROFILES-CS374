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
