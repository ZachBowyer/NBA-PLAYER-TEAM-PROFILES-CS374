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
    document.getElementById("ProfilePicture").src = getPlayerPictureFromName(playerName)
}
