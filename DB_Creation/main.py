import os
import sqlite3
import csv
conn = sqlite3.connect('NBA_Stats.db')
print("Opened/created database successfully")
cursor = conn.cursor()

os.system('cls')
#Creates TeamTotals table

#Given a sqlite3 connection cursor object and a table name,
#will return true if the given table exists
def checkIfTableExists(cursor, TableName):
    cursor.execute(""" SELECT count(*) FROM sqlite_master WHERE type='table' AND name='{}' """.format(TableName))
    return (cursor.fetchone()[0]==1)

#Given a csvfile, returns an array of arrays, where each inner array elements are the csv values
def getDataFromCsv(FilePath):
    DataList = []
    with open(FilePath, newline = '', encoding = 'utf-8') as csvfile:
        data = csv.reader(csvfile, delimiter = ',')
        for row in data:
            DataList.append(row)

    return DataList


TeamTotalData = getDataFromCsv('TeamTotals.csv')
TeamOppTotalData = getDataFromCsv('TeamOppTotals.csv')
PlayerData = getDataFromCsv('PlayerTotals.csv')
ShotChartData = getDataFromCsv('shots-2019.csv')
SalaryData = getDataFromCsv('PlayerSalaries.csv')
print(len(TeamTotalData))
print(len(TeamOppTotalData))
print(len(PlayerData))
print(len(ShotChartData))
print(len(SalaryData))

ShotChartData.pop(0)
TeamTotalData.pop(0)
TeamOppTotalData.pop(0)
PlayerData.pop(0)
SalaryData.pop(0)




if(checkIfTableExists(cursor, 'TeamTotals')):
    print("TeamTotals table exists")
else:
    print('Table DNE')
    conn.execute("""CREATE TABLE TeamTotals
    (Abbr TEXT PRIMARY KEY,
    TeamName VARCHAR(255),
    GamesPlayed INTEGER,
    Minutes INTEGER,
    FGM INTEGER,
    FGA INTEGER,
    ThreePointM INTEGER,
    ThreePointA INTEGER,
    TwoPointM INTEGER,
    TwoPointA INTEGER,
    FT INTEGER,
    FTA INTEGER,
    ORB INTEGER,
    DRB INTEGER,
    AST INTEGER,
    STL INTEGER,
    BLK INTEGER,
    TOV INTEGER,
    PF INTEGER,
    PTS INTEGER);""")
    print("Table TeamTotals created")


#Creates TeamOpponentTotals table
if(checkIfTableExists(cursor, 'TeamOppTotals')):
    print("TeamTotals table exists")
else:
    conn.execute("""CREATE TABLE TeamOppTotals
            (Abbr TEXT PRIMARY KEY,
             TeamName VARCHAR(255),
             GamesPlayed INTEGER,
             Minutes INTEGER,
             FGM INTEGER,
             FGA INTEGER,
             ThreePointM INTEGER,
             ThreePointA INTEGER,
             TwoPointM INTEGER,
             TwoPointA INTEGER,
             FT INTEGER,
             FTA INTEGER,
             ORB INTEGER,
             DRB INTEGER,
             AST INTEGER,
             STL INTEGER,
             BLK INTEGER,
             TOV INTEGER,
             PF INTEGER,
             PTS INTEGER);""")
    print("Table TeamOppTotals created")

#Creates PlayerTotals table

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
             MP INTEGER,
             FGM INTEGER,
             FGA INTEGER,
             ThreePointM INTEGER,
             ThreePointA INTEGER,
             TwoPointM INTEGER,
             TwoPointA INTEGER,
             FT INTEGER,
             FTA INTEGER,
             ORB INTEGER,
             DRB INTEGER,
             AST INTEGER,
             STL INTEGER,
             BLK INTEGER,
             TOV INTEGER,
             PF INTEGER,
             PTS INTEGER);""")
    print("Table PlayerTotals created")

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

if(checkIfTableExists(cursor, 'PlayerSalaries')):
    print("PlayerSalaries table exists")
else:
    conn.execute("""CREATE TABLE PlayerSalaries
                    (rank INTEGER,
                     player VARCHAR(255),
                     Team TEXT,
                     Salary TEXT);""")
    print("Table PlayerSalaries created")


#Insert data into db file
for i in range(len(TeamTotalData)):
    cursor.execute('INSERT INTO TeamTotals VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', tuple(TeamTotalData[i]))

for i in range(len(TeamOppTotalData)):
    cursor.execute('INSERT INTO TeamOppTotals VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', tuple(TeamOppTotalData[i]))

for i in range(len(PlayerData)):
    cursor.execute('INSERT INTO PlayerTotals VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', tuple(PlayerData[i]))

for i in range(len(ShotChartData)):
    ShotChartData[i].pop(0)
    ShotChartData[i].pop(0)
    ShotChartData[i].pop(9)
    ShotChartData[i].pop(len(ShotChartData[i])-1)
    ShotChartData[i].pop(len(ShotChartData[i])-1)
    ShotChartData[i].pop(len(ShotChartData[i])-1)
    ShotChartData[i].pop(len(ShotChartData[i])-1)
    ShotChartData[i].pop(len(ShotChartData[i])-1)
    ShotChartData[i][7].replace(',',' ')
    cursor.execute('INSERT INTO PlayerShotCharts VALUES(?,?,?,?,?,?,?,?,?,?,?)', tuple(ShotChartData[i]))

for i in range(len(SalaryData)):
    cursor.execute('INSERT INTO PlayerSalaries VALUES(?,?,?,?)', tuple(SalaryData[i]))


conn.commit()
conn.close()

