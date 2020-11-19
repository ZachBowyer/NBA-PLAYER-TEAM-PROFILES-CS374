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
	let data = SQLPostRequest('SELECT * FROM PlayerTotals WHERE PlayerName LIKE "' + playerName + '%"');
	console.log(data)

    //Populate player stats table with data from DB using tabulator js
    var tabledata = data

    //create Tabulator on DOM element with id "example-table"
    var table = new Tabulator("#table", 
    {
		data:tabledata, //assign data to table
 	    columns:[
	    	{title:"Team", field:"Team", width:70, formatter: "link", cellClick:function(e, cell){
				console.log(cell.getValue())
				let fullName = SQLPostRequest('SELECT * FROM TeamTotals WHERE Abbr = "' + cell.getValue() + '"')[0].TeamName
				console.log(fullName)
				goToTeamPage(fullName)
			},},
	    	{title:"PTS", field:"PTS", width:60},
	    	{title:"AST", field:"AST", width:65},
	    	{title:"ORB", field:"ORB", width:65},
	    	{title:"DRB", field:"DRB", width:65},
	    	{title:"BLK", field:"BLK", width:65},
	    	{title:"FGA", field:"FGA", width:65},
	    	{title:"FT", field:"FT", width:60},
	    	{title:"FTA", field:"FTA", width:65},
	    	{title:"G", field:"G", width:60},
	    	{title:"GS", field:"GS", width:60},
	    	{title:"MP", field:"MP", width:60},
	    	{title:"PF", field:"PF", width:60},
	    	{title:"STL", field:"STL", width:65},
	    	{title:"TOV", field:"TOV", width:65},
	    	{title:"3PA", field:"ThreePointA", width:60},
	    	{title:"3PM", field:"ThreePointM", width:65},
	    	{title:"2PA", field:"TwoPointA", width:60},
	    	{title:"2PM", field:"TwoPointM", width:65},
	    	                                        ],
	});

	//Create impact pie chart
	//if player has played for multiple teams, select the data from the total category
	if(data.length > 1)
	{
		data = SQLPostRequest('SELECT * FROM PlayerTotals WHERE PlayerName LIKE "' + playerName + '%" and Team = "TOT"');
	}
	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart(ctx,{
		type: 'pie',
		data: {
		  labels: ["Points", "Assists", "REB", "BLK/STL", "TOV/FOULS"],
		  datasets: [{
			backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9", "#FF4C33"],
			data: [data[0].PTS, data[0].AST, (data[0].DRB + data[0].ORB), data[0].BLK + data[0].STL, data[0].TOV + data[0].PF]
		  }]
		},
		options: {
		  title: {
			display: true,
			text: 'Impact'
		  }
		}
	});

	//Create ranking pie charts
	let numberOfPlayers = SQLPostRequest('SELECT DISTINCT PlayerName FROM PlayerTotals').length;
	let PTSRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY PTS DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
	let ASTRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY AST DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
	let REBRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TRB DESC) RANK FROM (SELECT *, ORB+DRB as TRB FROM PlayerTotals)) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
	let STLRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY STL DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
	let BLKRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY BLK DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
	let TOVRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TOV DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
	RankPieChart("PointsRankChart", playerName, numberOfPlayers, PTSRank, "Points")
	RankPieChart("AssistRankChart", playerName, numberOfPlayers, ASTRank, "Assists")
	RankPieChart("ReboundRankChart", playerName, numberOfPlayers, REBRank, "Rebounds")
	RankPieChart("StealRankChart", playerName, numberOfPlayers, STLRank, "Steals")
	RankPieChart("BlockRankChart", playerName, numberOfPlayers, BLKRank, "Blocks")
	RankPieChart("TurnoverRankChart", playerName, numberOfPlayers, TOVRank, "Turnover")


	//Create player shot chart
	let ShotData = SQLPostRequest('SELECT * FROM PlayerShotCharts WHERE shots_by LIKE "' + playerName.split("\\")[0] + '%"')
	console.log(ShotData)
	console.log(playerName)
	for(var i = 0; i < ShotData.length; i++)
	{
		let symbol = "●";
		if(ShotData[i].outcome == "missed")
		{
			symbol = "×"
		}

		ShotData[i].x = ShotData[i].x.split("p")[0];
		ShotData[i].x = parseInt(ShotData[i].x);
		ShotData[i].x = ShotData[i].x / 1.5;
		ShotData[i].x = ShotData[i].x.toString() + "px";

		ShotData[i].y = ShotData[i].y.split("p")[0];
		ShotData[i].y = parseInt(ShotData[i].y);
		ShotData[i].y = ShotData[i].y / 1.5;
		ShotData[i].y = ShotData[i].y.toString() + "px";


		$("#ShotChartParent").append('<div style="position:absolute;top:' + ShotData[i].x + ';left:' + ShotData[i].y + '" tip="' + ShotData[i].play + '">'+symbol+'</div>');
	}
};

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