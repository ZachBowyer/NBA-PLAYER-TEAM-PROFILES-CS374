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




TeamTotalData = getDataFromCsv('TeamTotals.csv')
TeamOppTotalData = getDataFromCsv('TeamOppTotals.csv')
PlayerData = getDataFromCsv('PlayerTotals.csv')
print(len(TeamTotalData))
print(len(TeamOppTotalData))
print(len(PlayerData))

TeamTotalData.pop(0)
TeamOppTotalData.pop(0)
PlayerData.pop(0)


#Insert data into db file
for i in range(len(TeamTotalData)):
    print(tuple(TeamTotalData[i]))
    cursor.execute('INSERT INTO TeamTotals VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', tuple(TeamTotalData[i]))

for i in range(len(TeamOppTotalData)):
    print(tuple(TeamOppTotalData[i]))
    cursor.execute('INSERT INTO TeamOppTotals VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', tuple(TeamOppTotalData[i]))

for i in range(len(PlayerData)):
    print(tuple(PlayerData[i]))
    cursor.execute('INSERT INTO PlayerTotals VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', tuple(PlayerData[i]))

#cursor.execute(""" INSERT INTO TeamTotals VALUES()""")

conn.commit()

conn.close()

