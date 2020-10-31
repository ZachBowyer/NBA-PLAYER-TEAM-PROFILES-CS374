print("Hello world")
import sqlite3
conn = sqlite3.connect('NBA_Stats.db')
print("Opened/created database successfully")

conn.execute("""CREATE TABLE TeamTotals
            (Abbr TEXT PRIMARY KEY,
             TEAM VARCHAR(255),
             GAMES INTEGER,
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

             #3P INTEGER,
             #3PA INTEGER,
             #3P_Perc REAL,
             #2P INTEGER,
             #2PA INTEGER
             #2P_Perc REAL,
             #FT INTEGER,
             #FTA INTEGER
             #FT_Perc REAL,
             #ORD INTEGER,
             #DRB INTEGER,
             #TRB INTEGER,
             #AST INTEGER,
             #STL INTEGER,
             #BLK INTEGER,
             #TOV INTEGER,
             #PF INTEGER,
             #PTS INTEGER)
