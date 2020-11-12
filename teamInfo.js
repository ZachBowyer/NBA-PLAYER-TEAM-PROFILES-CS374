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

function populateHTML(playerName)
{
    let teamAbbreviation = SQLPostRequest('SELECT DISTINCT Abbr FROM TeamTotals WHERE TeamName LIKE "' + playerName + '%"');
    console.log("https://d2p3bygnnzw9w3.cloudfront.net/req/202010221/tlogo/bbr/" + teamAbbreviation[0].Abbr + ".png")
    document.getElementById("ProfilePicture").src = "https://d2p3bygnnzw9w3.cloudfront.net/req/202010221/tlogo/bbr/" + teamAbbreviation[0].Abbr + ".png"
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