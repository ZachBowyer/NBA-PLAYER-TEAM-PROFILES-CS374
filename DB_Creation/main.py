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
    FG_Perc REAL,
    ThreePointM INTEGER,
    ThreePointA INTEGER,
    ThreePoint_Perc REAL,
    TwoPointM INTEGER,
    TwoPointA INTEGER,
    TwoPoint_Perc REAL,
    FT INTEGER,
    FTA INTEGER,
    FT_Perc REAL,
    ORB INTEGER,
    DRB INTEGER,
    TRB INTEGER,
    AST INTEGER,
    STL INTEGER,
    BLK INTEGER,
    TOV INTEGER,
    PF INTEGER,
    PTS INTEGER);""")
    print("Table TeamTotals created")



TeamTotalData = getDataFromCsv('TeamTotals.csv')
TeamOppTotalData = getDataFromCsv('TeamOppTotals.csv')
PlayerData = getDataFromCsv('PlayerTotals.csv')
print(len(TeamTotalData))
print(len(TeamOppTotalData))
print(len(PlayerData))


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
             FG_Perc REAL,
             ThreePointM INTEGER,
             ThreePointA INTEGER,
             ThreePoint_Perc REAL,
             TwoPointM INTEGER,
             TwoPointA INTEGER,
             TwoPoint_Perc REAL,
             FT INTEGER,
             FTA INTEGER,
             FT_Perc REAL,
             ORB INTEGER,
             DRB INTEGER,
             TRB INTEGER,
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
             FG_Perc REAL,
             ThreePointM INTEGER,
             ThreePointA INTEGER,
             ThreePoint_Perc REAL,
             TwoPointM INTEGER,
             TwoPointA INTEGER,
             TwoPoint_Perc REAL,
             eFG_Perc Real,
             FT INTEGER,
             FTA INTEGER,
             FT_Perc REAL,
             ORB INTEGER,
             DRB INTEGER,
             TRB INTEGER,
             AST INTEGER,
             STL INTEGER,
             BLK INTEGER,
             TOV INTEGER,
             PF INTEGER,
             PTS INTEGER);""")
    print("Table PlayerTotals created")

conn.close()

