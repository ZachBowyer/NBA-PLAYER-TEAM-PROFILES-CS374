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

    //Populate player stats table with data from DB using tabulator js
    var tabledata = data

    //create Tabulator on DOM element with id "example-table"
    var table = new Tabulator("#example-table", 
    {
        //Table settings
        //maxHeight:"90%",
        //layout:"fitDataTable",
        data:tabledata, //assign data to table
        //resizeable:true,

        //Define columns
 	    columns:[
	    	{title:"Team", field:"Team", width:70},
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
	    	{title:"2PA", field:"TwoPointM", width:60},
	    	{title:"2PM", field:"TwoPointM", width:65},
	    	                                        ],
	});

    console.log(data)
	//Create main player impact pie chart

	//if player has played for multiple teams, select the data from the total category
	if(data.length > 1)
	{
		data = SQLPostRequest('SELECT * FROM PlayerTotals WHERE PlayerName LIKE "' + playerName + '%" and Team = "TOT"');
	}
    console.log(data)
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

};
