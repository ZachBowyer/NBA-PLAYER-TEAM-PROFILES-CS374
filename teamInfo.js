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
    //let tabledata = SQLPostRequest('SELECT PlayerName, Pos, Age FROM (SELECT TeamTotals.Abbr FROM TeamTotals WHERE TeamName LIKE "'
    //                         + teamName + '%") AS T1 INNER JOIN PlayerTotals ON T1.Abbr = PlayerTotals.Team')                    
              
    //let tabledata = SQLPostRequest('SELECT * FROM PlayerTotals INNER JOIN PlayerSalaries ON PlayerTotals.PlayerName = PlayerSalaries.player')

    let tabledata = SQLPostRequest('SELECT PlayerName, Pos, Age, Salary FROM (SELECT TeamTotals.Abbr FROM TeamTotals WHERE TeamName LIKE "'
                             + teamName + '%") AS T1 INNER JOIN (SELECT * FROM PlayerTotals INNER JOIN PlayerSalaries ON PlayerTotals.PlayerName = PlayerSalaries.player) AS T2 ON T1.Abbr = T2.Team')                    
                             
    console.log("tableData is: ", tabledata)

    //Convert playerName strings into just names
    for(var i = 0; i < tabledata.length; i++)
    {
        tabledata[i].PlayerName = tabledata[i].PlayerName.split("\\")[0]
    }
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
	    	{title:"Salary", field:"Salary", width:65},
        ]
    });

    //Create offensive and defensive rating PIE charts
    let numberOfTeams = SQLPostRequest('SELECT * FROM TeamTotals').length-1
    let PTSRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY PTS DESC) RANK FROM TeamTotals WHERE Abbr != "AVG") WHERE TeamName LIKE "' + teamName + '%"')[0].RANK;
    let DEF_PTSRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY PTS ASC) RANK FROM TeamOPPTotals WHERE Abbr != "AVG") WHERE TeamName LIKE "' + teamName + '%"')[0].RANK;
    RankPieChart("OFF", teamName, numberOfTeams, PTSRank, "Points scored")
    RankPieChart("DEF", teamName, numberOfTeams, DEF_PTSRank, "Points allowed")
}

function RankPieChart(ElementID, name, numberOfOther, Rank, Category)
{
	var ctx = document.getElementById(ElementID).getContext('2d');
	var myChart = new Chart(ctx,{
		type: 'pie',
		data: {
		  labels: [name, "Rest of league"],
		  datasets: [{
			backgroundColor: ["#3e95cd", "#8e5ea2"],
			data: [numberOfOther-Rank, Rank]
		  }]
		},
		options: {
		  title: {
			display: true,
			text: Category + ': RANKS #' + Rank
		  }
		}
	});
}