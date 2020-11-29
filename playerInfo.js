let playername = 0;
let numberOfPlayers = 0;

function LoadPlayerInfo()
{
    console.log("Player File loaded")
    playerName = decodeURI((window.location.href).split("#")[1]);
    populateHTML(playerName)
}

function populateHTML(playerName)
{
    document.getElementById("ProfilePicture").src = getPlayerPictureFromName(playerName)
	numberOfPlayers = SQLPostRequest('SELECT DISTINCT PlayerName FROM PlayerTotals').length;
	let data = SQLPostRequest('SELECT * FROM PlayerTotals WHERE PlayerName LIKE "' + playerName + '%"');
	let PTSRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY PTS DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
	let ASTRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY AST DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
	let REBRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TRB DESC) RANK FROM (SELECT *, ORB+DRB as TRB FROM PlayerTotals)) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
	let STLRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY STL DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
	let BLKRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY BLK DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
	let TOVRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TOV DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;

	//Populate player stats table with data from DB using tabulator js
	//Create pie charts of players ranks
	ChangeTableAndChartData(data, PTSRank, ASTRank, REBRank, STLRank, BLKRank, TOVRank)

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

	//Create player shot chart
	let ShotData = SQLPostRequest('SELECT * FROM PlayerShotCharts WHERE shots_by LIKE "' + playerName.split("\\")[0] + '%"')
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

//When selector value changes
document.getElementById("Selections").addEventListener('change', (event) => 
{
	let SelectorValue = event.target.value;
	let PTSRank = 0;
	let ASTRank = 0;
	let REBRank = 0;
	let STLRank = 0;
	let BLKRank = 0;
	let TOVRank = 0;
	switch(SelectorValue)
	{
		case "Total":
			console.log("Total")
			tableData = SQLPostRequest('SELECT * FROM PlayerTotals WHERE PlayerName LIKE "' + playerName + '%"')
			PTSRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY PTS / G DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			ASTRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY AST / G DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			REBRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TRB / G DESC) RANK FROM (SELECT *, ORB+DRB as TRB FROM PlayerTotals)) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			STLRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY STL / G DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			BLKRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY BLK / G DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			TOVRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TOV / G DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			ChangeTableAndChartData(tableData, PTSRank, ASTRank, REBRank, STLRank, BLKRank, TOVRank)
			break;
		case "Per_game":
			console.log("Per Game")
			PTSRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY PTS / G DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			ASTRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY AST / G DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			REBRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TRB / G DESC) RANK FROM (SELECT *, ORB+DRB as TRB FROM PlayerTotals)) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			STLRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY STL / G DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			BLKRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY BLK / G DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			TOVRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TOV / G DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			tableData = SQLPostRequest('SELECT TEAM, round(PTS / G, 2) AS PTS, round(AST / G, 2) as AST, round(ORB / G, 2) as ORB, round(DRB / G, 2) AS DRB, '
										+ 'round(BLK / G,2) AS BLK, round(FGA / G,2) AS FGA, round(FT / G,2) AS FT, round(FTA / G,2) AS FTA, G, GS, round(MP / G,2) as MP, ' 
										+ 'round(PF / G,2) as PF, round(STL / G,2) as STL, round(TOV / G,2) as TOV, round(ThreePointA / G,2) as ThreePointA, ' 
										+ 'round(ThreePointM / G,2) as ThreePointM, round(TwoPointA / G,2) as TwoPointA, round(TwoPointM / G,2) as TwoPointM ' 
										+ 'FROM PlayerTotals WHERE PlayerName LIKE "' + playerName + '%"')
			ChangeTableAndChartData(tableData, PTSRank, ASTRank, REBRank, STLRank, BLKRank, TOVRank)
			break;
		case "Per_36":
			console.log("Per 36")
			PTSRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY PTS * 36 / MP DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			ASTRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY AST * 36 / MP DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			REBRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TRB * 36 / MP DESC) RANK FROM (SELECT *, ORB+DRB as TRB FROM PlayerTotals)) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			STLRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY STL * 36 / MP DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			BLKRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY BLK * 36 / MP DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			TOVRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TOV * 36 / MP DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			tableData = SQLPostRequest('SELECT TEAM, round(PTS * 36 / MP, 2) AS PTS, round(AST * 36 / MP, 2) as AST, round(ORB * 36 / MP, 2) as ORB, round(DRB * 36 / MP, 2) AS DRB, '
										+ 'round(BLK * 36 / MP,2) AS BLK, round(FGA * 36 / MP,2) AS FGA, round(FT * 36 / MP,2) AS FT, round(FTA * 36 / MP,2) AS FTA, G, GS, MP, ' 
										+ 'round(PF * 36 / MP,2) as PF, round(STL * 36 / MP,2) as STL, round(TOV * 36 / MP,2) as TOV, round(ThreePointA * 36 / MP,2) as ThreePointA, ' 
										+ 'round(ThreePointM * 36 / MP,2) as ThreePointM, round(TwoPointA * 36 / MP,2) as TwoPointA, round(TwoPointM * 36 / MP,2) as TwoPointM ' 
										+ 'FROM PlayerTotals WHERE PlayerName LIKE "' + playerName + '%"')
			ChangeTableAndChartData(tableData, PTSRank, ASTRank, REBRank, STLRank, BLKRank, TOVRank)
			break;
		case "Per_minute":
			console.log("Per minute")
			PTSRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY PTS / MP DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			ASTRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY AST / MP DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			REBRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TRB / MP DESC) RANK FROM (SELECT *, ORB+DRB as TRB FROM PlayerTotals)) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			STLRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY STL / MP DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			BLKRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY BLK / MP DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			TOVRank = SQLPostRequest('SELECT * FROM (SELECT *, RANK () OVER (ORDER BY TOV / MP DESC) RANK FROM PlayerTotals) WHERE PlayerName LIKE "' + playerName + '%"')[0].RANK;
			tableData = SQLPostRequest('SELECT TEAM, round(PTS / MP, 2) AS PTS, round(AST / MP, 2) as AST, round(ORB / MP, 2) as ORB, round(DRB / MP, 2) AS DRB, '
										+ 'round(BLK / MP,2) AS BLK, round(FGA / MP,2) AS FGA, round(FT / MP,2) AS FT, round(FTA / MP,2) AS FTA, G, GS, MP, ' 
										+ 'round(PF / MP,2) as PF, round(STL / MP,2) as STL, round(TOV / MP,2) as TOV, round(ThreePointA / MP,2) as ThreePointA, ' 
										+ 'round(ThreePointM / MP,2) as ThreePointM, round(TwoPointA / MP,2) as TwoPointA, round(TwoPointM / MP,2) as TwoPointM ' 
										+ 'FROM PlayerTotals WHERE PlayerName LIKE "' + playerName + '%"')
			ChangeTableAndChartData(tableData, PTSRank, ASTRank, REBRank, STLRank, BLKRank, TOVRank)
			break;
	}
});

function ChangeTableAndChartData(tableData, PTSRank, ASTRank, REBRank, STLRank, BLKRank, TOVRank)
{
	//Change contents of the table
	table = new Tabulator("#table", 
    {
		data:tableData, //assign data to table
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
	    	{title:"2PM", field:"TwoPointM", width:65},],
	});

	//Change contents of ranking pie charts
	RankPieChart("PointsRankChart", playerName, numberOfPlayers, PTSRank, "Points")
	RankPieChart("AssistRankChart", playerName, numberOfPlayers, ASTRank, "Assists")
	RankPieChart("ReboundRankChart", playerName, numberOfPlayers, REBRank, "Rebounds")
	RankPieChart("StealRankChart", playerName, numberOfPlayers, STLRank, "Steals")
	RankPieChart("BlockRankChart", playerName, numberOfPlayers, BLKRank, "Blocks")
	RankPieChart("TurnoverRankChart", playerName, numberOfPlayers, TOVRank, "Turnover")
}