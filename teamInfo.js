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

    //Create roster table via tabulator js
    let tabledata = SQLPostRequest('SELECT PlayerName, Pos, Age FROM (SELECT TeamTotals.Abbr FROM TeamTotals WHERE TeamName LIKE "'
                             + teamName + '%") AS T1 INNER JOIN PlayerTotals ON T1.Abbr = PlayerTotals.Team')
    console.log(tabledata);

    var table = new Tabulator("#RosterTable",
    {
        data:tabledata, //assign data to table
        columns:[
            {title:"Name", field:"PlayerName", width:170, formatter: "link", cellClick:function(e, cell){
				console.log(cell.getValue())
				goToPlayerPage(cell.getValue())
            },},
            {title:"POS", field:"Pos", width:100},
	    	{title:"AGE", field:"Age", width:65},
        ]
    });
}