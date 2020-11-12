function LoadTeamInfo()
{
    console.log("Team File loaded")
    let teamName = (extractUrlVariable(window.location.href))
    populateHTML(teamName)
}

function extractUrlVariable(urlString)
{
    return decodeURI(urlString.split("#")[1]);
}

function populateHTML(teamName)
{
    document.getElementById("ProfilePicture").src = getTeamPicutureFromName(teamName);
}