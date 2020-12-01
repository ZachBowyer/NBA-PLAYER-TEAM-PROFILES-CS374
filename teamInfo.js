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
    let teamAbbreviation = SQLPostRequest('SELECT Abbr From TeamTotals WHERE TeamName LIKE "' + teamName + '%"')[0].Abbr

    //Create roster table via tabulator js
    let tabledata = SQLPostRequest('SELECT * FROM (SELECT PlayerName, Pos, Age FROM (SELECT TeamTotals.Abbr FROM TeamTotals WHERE TeamName LIKE "'
                             + teamName + '%") AS T1 INNER JOIN PlayerTotals ON T1.Abbr = PlayerTotals.Team) AS Q INNER JOIN (SELECT * FROM PlayerSalaries WHERE Team LIKE "' + teamAbbreviation + '%") AS Q2 ON Q.PlayerName = Q2.Player')                    
              
    console.log(teamAbbreviation)
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
	    	{title:"Salary", field:"Salary", width:100},
        ]
    });

    //Create offensive and defensive rating PIE charts
    let numberOfTeams = SQLPostRequest('SELECT * FROM TeamTotals').length-1
    let PTSRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY PTS DESC) RANK FROM TeamTotals WHERE Abbr != "AVG") WHERE TeamName LIKE "' + teamName + '%"')[0].RANK;
    let DEF_PTSRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY PTS ASC) RANK FROM TeamOPPTotals WHERE Abbr != "AVG") WHERE TeamName LIKE "' + teamName + '%"')[0].RANK;
    RankPieChart("OFF", teamName, numberOfTeams, PTSRank, "Points scored")
    RankPieChart("DEF", teamName, numberOfTeams, DEF_PTSRank, "Points allowed")

    //create player impact for team pie chart
    let players = SQLPostRequest('SELECT PlayerName, PTS, AST, DRB, ORB, BLK, STL FROM PlayerTotals WHERE Team LIKE "' + teamAbbreviation + '%"')
    let playerImpactWeights = []
    let playerImpacts = []
    let playerNames = []
    let teamTotals = SQLPostRequest('SELECT * FROM TeamTotals WHERE Abbr LIKE "' + teamAbbreviation + '%"')
    for(var i = 0; i < players.length; i++)
    {
      let PointsWeight = (players[i].PTS / teamTotals[0].PTS) * 100;
      let ASTWeight = (players[i].AST / teamTotals[0].AST) * 100;
      let TRBWeight = (players[i].DRB + players[i].ORB) / (teamTotals[0].ORB + teamTotals[0].DRB) * 100;
      let BLKWeight = (players[i].BLK / teamTotals[0].BLK) * 100;
      let STLWeight = (players[i].STL / teamTotals[0].STL) * 100;
      let totalPlayerWeight = PointsWeight + ASTWeight + TRBWeight + BLKWeight + STLWeight; 
      let playerInfo = { Name: players[i].PlayerName.split("\\")[0], Score: totalPlayerWeight}
      playerImpactWeights.push(playerInfo)
      playerImpacts.push(totalPlayerWeight)
      playerNames.push(players[i].PlayerName.split("\\")[0])
    }
    console.log(playerImpactWeights);

    var ctx = document.getElementById("Players").getContext('2d');
	  var myChart = new Chart(ctx,{
		type: 'pie',
		data: {
		  labels: playerNames,
		  datasets: [{
			backgroundColor: ["#3e95cd", "#8e5ea2", "Yellow", "Silver", "Gray", "Black", "Red", "Olive", "Lime", "Green", "Aqua", "Teal", "Blue", "Navy", "Fuchsia", "Purple", "Silver", "Gray", "Black"],
			data: playerImpacts
		  }]
		},
		options: {
		  title: {
			display: true,
			text: 'Player Impacts'
		  }
		}
  });
  
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