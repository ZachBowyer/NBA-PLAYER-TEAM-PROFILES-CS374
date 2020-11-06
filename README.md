# NBA-PLAYER-TEAM-PROFILES-CS374
Fall 2020 CS 374 (Database management) project

Overview: 
The application that I will create is an NBA profile and statistics system for both NBA players and teams. For now, my plans are to only include data for the 2019-2020 NBA season, due to the large amount of data needed for every season. The application is a website, which will be ran by a web server. 

System requirements:
As of now, the entirety of the project will include:
1.	JavaScript – This is a very common and popular web scripting language, and I have some experience with it.
2.	HTML – Necessary for any website
3.	CSS – Used to style HTML
4.	Node.js – Very popular software that allows JavaScript to be run outside of a web browser. The project uses node package manager (NPM) to install important modules.
5.	SQLITE3 – DBMS library that is self-contained, installed via NPM
6.	Express JS – Node.js web server library. Allows HTTP requests. 
7.	Nodemon – Node.js library that automatically restarts express web server when changes are detected.
8.	Python version 3.9.0 – Used to create and populate SQLITE3 databases.

Extra software I use for development: Github, VSCode, DB Browser

Various other third-party files or libraries may be used. For example, I may download a JavaScript file that is good at making pie charts, or bar graphs. React may be a possibility for this project, but I am not sure yet.



Description

To start, the client will be able to access the website by connection to a localhost connection. For now, the connection is localhost:3000. This connection may be changed to the host computer’s IPv4 if port forwarding is possible. Once the client connects to the main URL, the web server will send the client the main-webpage information: index.html, index.js, and index.css. 

Index.html will be the website’s front page. The front page will consist of main search bar, a player table, and team table below the search bars. There will also hopefully be some decent looking background/graphic design to go along with the front page. From this page, the user should either be able to select a player or team via bottom tables or be able to search up a player/team through the main search bar. The main search bar will be dynamic, what this means is as the user is entering a name, the search bar will give relevant options to choose from based on the current user input. This can easily be done using the LIKE, “_”, and “%” operators of SQL. The user can either click on of the suggestions of the search bar to take them to the player/team profile, or press enter. Pressing enter will take the user to another page that is a list of all relevant options, and then the user can choose which one they want from there. 

If the user decides to go to a player profile, they will get sent another batch of html/js/css files, which will most likely be called playerInfo.html, playerInfo.js, playerInfo.css. On this page, the user will be able to view the player’s stats, shot chart, picture, etc. I am not completely sure what the final product will look like there, but my current thoughts are that there will be a player profile picture on the right, and then a player stat table on the left. The player stat table will have tabs that let the user see the player’s stats adjusted to per game, season total, or per any number of minutes less than or equal to 48. The player will also have a shot chart somewhere on the right side of the page as well. Lastly, the player will have some sort of pie chart/graph that tries to show what type of player they are. (For example, do they score a lot of points or rebound the ball a lot). From this page, the user will of course be able to click on the team the player is a part of. The search bar will also be present on this page if the user decides to search for another team or player. The player profile may also have an offensive and defensive rank displayed near the top.

If the user decides to go to a team profile, they again will receive another batch of files. These files will most likely be called teamInfo.html, teamInfo.js, teamInfo.css. On this page, the search bar will again be present at the top, as well as similar features to the player profile. There will again be a team picture, a team table stat (with per game, totals, per minute stats). Along with that, I plan on making a team pie chart, where the pie chart represents team statistics divided by player statistics as a percentage. This pie chart will take all players that were on that team into account for the season. Also, the pie chart will have tabs that allows the user to view the player spread for all major statistical categories. The teams may also have an offensive and defensive rank displayed at the top.
