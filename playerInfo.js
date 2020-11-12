function LoadPlayerInfo()
{
    console.log("Player File loaded")
    let playerName = (extractUrlVariable(window.location.href))
    populateHTML(playerName)
}

function extractUrlVariable(urlString)
{
    return decodeURI(urlString.split("#")[1]);
}

function populateHTML(playerName)
{
    console.log("https://www.basketball-reference.com/req/202011101/images/players/" + createPlayerSearchString(playerName) + ".jpg")
    document.getElementById("ProfilePicture").src = "https://www.basketball-reference.com/req/202011101/images/players/" + createPlayerSearchString(playerName) + ".jpg"
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