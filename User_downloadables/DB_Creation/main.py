# Python file that creates the SQLITE3 database file
# Uses various csv files to construct and populate tables
#
# Note: Data from shot-2019.csv is incomplete, no easy way around it.
#       ShotChart data was manually scrapped off of basketball-reference.com

import os
import sqlite3
import csv

#Connect to database file or create it if it already exists
conn = sqlite3.connect('NBA_Stats.db')
print("Opened/created database successfully")
cursor = conn.cursor()

#Clear screen
os.system('cls')

#Given a sqlite3 connection cursor object and a table name,
# will return true if the given table exists
def checkIfTableExists(cursor, TableName):
    cursor.execute(""" SELECT count(*) FROM sqlite_master WHERE type='table' AND name='{}' """.format(TableName))
    return (cursor.fetchone()[0]==1)

#Given a csvfile, returns an array of arrays, 
# where each inner array elements are the csv values
def getDataFromCsv(FilePath):
    DataList = []
    with open(FilePath, newline = '', encoding = 'utf-8') as csvfile:
        data = csv.reader(csvfile, delimiter = ',')
        for row in data:
            DataList.append(row)

    return DataList


#Retreive data from csv files
TeamTotalData = getDataFromCsv('TeamTotals.csv')
TeamOppTotalData = getDataFromCsv('TeamOppTotals.csv')
PlayerData = getDataFromCsv('PlayerTotals.csv')
ShotChartData = getDataFromCsv('shots-2019.csv')
SalaryData = getDataFromCsv('PlayerSalaries.csv')

#Print number of rows from each csv array
print(len(TeamTotalData))
print(len(TeamOppTotalData))
print(len(PlayerData))
print(len(ShotChartData))
print(len(SalaryData))

#Remove top row from each csv array (Top row is usually descriptions)
ShotChartData.pop(0)
TeamTotalData.pop(0)
TeamOppTotalData.pop(0)
PlayerData.pop(0)
SalaryData.pop(0)

# Create TeamTotals table schema
# Will not try to create if the table already exists
if(checkIfTableExists(cursor, 'TeamTotals')):
    print("TeamTotals table exists")
else:
    print('Table DNE')
    conn.execute("""CREATE TABLE TeamTotals
    (Abbr TEXT PRIMARY KEY,
    TeamName VARCHAR(255),
    GamesPlayed INTEGER,
    Minutes REAL,
    FGM REAL,
    FGA REAL,
    ThreePointM REAL,
    ThreePointA REAL,
    TwoPointM REAL,
    TwoPointA REAL,
    FT REAL,
    FTA REAL,
    ORB REAL,
    DRB REAL,
    AST REAL,
    STL REAL,
    BLK REAL,
    TOV REAL,
    PF REAL,
    PTS REAL);""")
    print("Table TeamTotals created")


# Create TeamOpponentTotals table schema
# Will not try to create if the table already exists
if(checkIfTableExists(cursor, 'TeamOppTotals')):
    print("TeamTotals table exists")
else:
    conn.execute("""CREATE TABLE TeamOppTotals
            (Abbr TEXT PRIMARY KEY,
             TeamName VARCHAR(255),
             GamesPlayed INTEGER,
             Minutes REAL,
             FGM REAL,
             FGA REAL,
             ThreePointM REAL,
             ThreePointA REAL,
             TwoPointM REAL,
             TwoPointA REAL,
             FT REAL,
             FTA REAL,
             ORB REAL,
             DRB REAL,
             AST REAL,
             STL REAL,
             BLK REAL,
             TOV REAL,
             PF REAL,
             PTS REAL);""")
    print("Table TeamOppTotals created")

# Create PlayerTotals table schema
# Will not try to create if the table already exists
if(checkIfTableExists(cursor, 'PlayerTotals')):
    print("PlayerTotals table exists")
else:
    conn.execute("""CREATE TABLE PlayerTotals
            (ID PRIMARY KEY,
             PlayerName VARCHAR(255),
             Pos TEXT,
             Age Integer,
             Team TEXT,
             G INTEGER,
             GS INTEGER,
             MP REAL,
             FGM REAL,
             FGA REAL,
             ThreePointM REAL,
             ThreePointA REAL,
             TwoPointM REAL,
             TwoPointA REAL,
             FT REAL,
             FTA REAL,
             ORB REAL,
             DRB REAL,
             AST REAL,
             STL REAL,
             BLK REAL,
             TOV REAL,
             PF REAL,
             PTS REAL);""")
    print("Table PlayerTotals created")

# Create PlayerShotCharts table schema
# Will not try to create if the table already exists
if(checkIfTableExists(cursor, 'PlayerShotCharts')):
    print("PlayerShotCharts table exists")
else:
    conn.execute("""CREATE TABLE PlayerShotCharts
                    (year INTEGER,
                     month INTEGER,
                     day INTEGER,
                     winner TEXT,
                     loser TEXT,
                     x TEXT,
                     y TEXT,
                     play VARCHAR(255),
                     time_remaining TEXT,
                     shots_by VARCHAR(255),
                     outcome TEXT);""")
    print("Table PlayerShotCharts created")


# Create PlayerSalaries table schema
# Will not try to create if the table already exists
if(checkIfTableExists(cursor, 'PlayerSalaries')):
    print("PlayerSalaries table exists")
else:
    conn.execute("""CREATE TABLE PlayerSalaries
                    (rank INTEGER,
                     player VARCHAR(255),
                     Team TEXT,
                     Salary TEXT);""")
    print("Table PlayerSalaries created")


# Once the schemas are defined for each table in the database
# and the data from each corresponding csv file is retreived into arrays,
# Populate the database tables with the csv data

#Insert data into TeamTotals table
for i in range(len(TeamTotalData)):
    cursor.execute('INSERT INTO TeamTotals VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', tuple(TeamTotalData[i]))

#Insert data into TeamOppTotals table
for i in range(len(TeamOppTotalData)):
    cursor.execute('INSERT INTO TeamOppTotals VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', tuple(TeamOppTotalData[i]))

#Insert data into PlayerTotals table
for i in range(len(PlayerData)):
    cursor.execute('INSERT INTO PlayerTotals VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', tuple(PlayerData[i]))

#Insert data into PlayerShotCharts table
for i in range(len(ShotChartData)):
    #pop()'s are being used to exclude unimportant data from the database
    ShotChartData[i].pop(0)
    ShotChartData[i].pop(0)
    ShotChartData[i].pop(9)
    ShotChartData[i].pop(len(ShotChartData[i])-1)
    ShotChartData[i].pop(len(ShotChartData[i])-1)
    ShotChartData[i].pop(len(ShotChartData[i])-1)
    ShotChartData[i].pop(len(ShotChartData[i])-1)
    ShotChartData[i].pop(len(ShotChartData[i])-1)

    #Removes commas from the 'play' field because commas are treated as separate values
    ShotChartData[i][7].replace(',',' ')
    cursor.execute('INSERT INTO PlayerShotCharts VALUES(?,?,?,?,?,?,?,?,?,?,?)', tuple(ShotChartData[i]))

#Insert data into PlayerSalaries table
for i in range(len(SalaryData)):
    cursor.execute('INSERT INTO PlayerSalaries VALUES(?,?,?,?)', tuple(SalaryData[i]))

# Commit changes and close database connection
conn.commit()
conn.close()

