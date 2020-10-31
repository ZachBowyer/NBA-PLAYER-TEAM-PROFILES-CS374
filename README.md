# NBA-PLAYER-TEAM-PROFILES-CS374
Fall 2020 CS 374 (Database management) project

Technologies used:
HTML/JS/CSS
NODEJS
sqlite3
expressJS
nodemon

For now, the application will only use 2019-2020 team and player stats.

Ideas:

3 html files

HTML FILE 1 - Front page
HTML FILE 2 - Player profile page
HTML FILE 3 - Team profile page

Each html file will have a main search bar across the top that the client
can use to search for a player or team. 

This main search bar will take the current user input into account and
construct/execute a query that will return each player/team that matches
the typed input from the user.

For example, if the user enters "Lebr", a query will get executed that will
search for all players with name starting with "Lebr" and those results will 
be put as reccomendations for the user to click on. 

If the user decides to enter an incomplete result, each 
choice will be displayed below the search bar and then the user will have to click on the 
one they want. 


The above will be possible in any html page.



HTML FILE 1 - Front page
    Will have search bar
    Decent looking graphic design (hopefully)
    Boxes where they can list all players, teams, etc

HTML FILE 2 - Player profile page
    This file is shown when the client clicks on a player via the search bar or through some
    other currently unknown method. This page will take the player's name or maybe some form of ID
    and use such to get player information via query. 

    The player page will display the player's picture.
    The player page will display the player's shot chart.
        [taken from another website, we can do this because we have the player name, 
        and the website that we are taking html from has been up for a very long time
        so the risk of the links being dead is low]
        
    There will also be 
