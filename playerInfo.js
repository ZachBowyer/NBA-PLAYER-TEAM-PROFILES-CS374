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
    //console.log(data[0])
    var tabledata = data
    console.log(data)
    console.log(tabledata)

    //define some sample data
    //var tabledata = [
 	//{id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
 	//{id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
 	//{id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
 	//{id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
 	//{id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
    //];


    //create Tabulator on DOM element with id "example-table"
    var table = new Tabulator("#example-table", 
    {
 	    //height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
 	    data:tabledata, //assign data to table
 	    //layout:"fitColumns", //fit columns to width of table (optional)
 	    columns:[ //Define Table Columns
	    	{title:"Team", field:"Team", width:150},
	    	{title:"PTS", field:"PTS", width:150},
	    	{title:"AST", field:"AST", width:150},
	    	{title:"ORB", field:"ORB", width:150},
	    	{title:"DRB", field:"DRB", width:150},
	    	{title:"BLK", field:"BLK", width:150},
	    	{title:"FGA", field:"FGA", width:150},
	    	{title:"FT", field:"FT", width:150},
	    	{title:"FTA", field:"FTA", width:150},
	    	{title:"G", field:"G", width:150},
	    	{title:"GS", field:"GS", width:150},
	    	{title:"MP", field:"MP", width:150},
	    	{title:"PF", field:"PF", width:150},
	    	{title:"STL", field:"STL", width:150},
	    	{title:"TOV", field:"TOV", width:150},
	    	{title:"3PA", field:"ThreePointA", width:150},
	    	{title:"3PM", field:"ThreePointM", width:150},
	    	{title:"2PA", field:"TwoPointM", width:150},
	    	{title:"2PM", field:"TwoPointM", width:150},
	    	                                        ],
    });
}
