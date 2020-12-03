//Executes when html page loads
function LoadTeamInfo()
{
    //take url variable, and extract team name
    //For example, if you are on the New York Knick's page
    //http://localhost:3000/User_downloadables/HTML_FILES/TeamInfo.html#New%20York%20Knicks
    //teamName will be "New York Knicks"
    let teamName = decodeURI((window.location.href).split("#")[1])

    //set team profile picture
    document.getElementById("ProfilePicture").src = getTeamPictureFromName(teamName);

    //Get team abbreviation
    let teamAbbreviation = SQLPostRequest('SELECT Abbr From TeamTotals WHERE TeamName LIKE "' + teamName + '%"')[0].Abbr

    //Create roster table via tabulator js
    let tabledata = SQLPostRequest('SELECT * FROM (SELECT PlayerName, Pos, Age FROM (SELECT TeamTotals.Abbr FROM TeamTotals WHERE TeamName LIKE "'
                             + teamName + '%") AS T1 INNER JOIN PlayerTotals ON T1.Abbr = PlayerTotals.Team) AS Q INNER JOIN (SELECT * FROM PlayerSalaries WHERE Team LIKE "' 
                             + teamAbbreviation + '%") AS Q2 ON Q.PlayerName = Q2.Player GROUP BY PlayerName')                    
    
    //Convert playerName strings into just names
    for(var i = 0; i < tabledata.length; i++){
        tabledata[i].PlayerName = tabledata[i].PlayerName.split("\\")[0]
    }

    //Create team roster table
    //Table created from tabledata player roster
    new Tabulator("#RosterTable",
    {
        layout:"fitDataFill",
        layout:"fitColumns",
        data:tabledata,
        columns:[
            {title:"Name", field:"PlayerName", width:170, formatter: "link", cellClick:function(e, cell){
				    console.log(cell.getValue())
				    goToPlayerPage(cell.getValue())
            },},
            {title:"POS", field:"Pos", width:100},
	    	{title:"AGE", field:"Age"},
	    	{title:"Salary", field:"Salary"},
        ]
    });

    //Create offensive and defensive rating PIE charts for the team
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

    //Combine player data to create weighting system for pie chart
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

    //Once data is collected for player ranking and player names
    //Construct pie chart
    var ctx = document.getElementById("Players").getContext('2d');
	  new Chart(ctx,{
		type: 'pie',
		data: {
      labels: playerNames,
		  datasets: [{
			backgroundColor: ["#3e95cd", "#8e5ea2", "Yellow", "Silver", "Gray", "Black", "Red", "Olive", "Lime", "Green", "Aqua", "Teal", "Blue", "Navy", "Fuchsia", "Purple", "Silver", "Gray", "Black", "Red", "Aqua", "Olive", "Lime"],
			data: playerImpacts
		  }]
		},
		options: {
      legend: {
            display: true,
            position: 'right',
            labels: {
                fontSize: 6,
            }
        },
		  title: {
        display: true,
        position: 'left',
			  text: 'Player Impacts'
		  }
		}
  });

  //Create team's shot chart
  //Combines every shot chart of every player on the roster
  let players2 = SQLPostRequest('SELECT * FROM PlayerTotals WHERE Team LIKE "' + teamAbbreviation + '%"')
  for(var i = 0; i < players2.length; i++)
  {
    let playerName = players2[i].PlayerName.split("\\")[0];
    let ShotData = SQLPostRequest('SELECT x,y,outcome FROM PlayerShotCharts WHERE shots_by LIKE "' + playerName + '%"')
  	for(var j = 0; j < ShotData.length; j++)
  	{
  		let symbol = "●";
  		if(ShotData[j].outcome == "missed") { symbol = "×" }
      
      //Extract shot data position from html
  		ShotData[j].x = parseInt(ShotData[j].x.split("p")[0]) / 1.5;
  		ShotData[j].y = parseInt(ShotData[j].y.split("p")[0]) / 1.5;

		  //Place shots onto page
      $("#ShotChartParent").append('<div style="position:absolute;top:' + ShotData[j].x + 'px;left:' + ShotData[j].y + 'px">'+symbol+'</div>')
      num++;
    }
  }
}

//Given the document elementID, name of the team, 
//Number of teams, the team's rank, and a cateogry
//Will construct a pie chart showing where the team stands in regard to the total number of teams
function RankPieChart(ElementID, name, numberOfOther, Rank, Category)
{
	var ctx = document.getElementById(ElementID).getContext('2d');
	new Chart(ctx,{
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