""" A simple Python script to connect to an SQLite3 database and create
    a table"""
import sqlite3

# Connect to a database. Will create one if it doesn't exist
conn = sqlite3.connect('database.db')
print ("Opened database successfully")

# execute a query
# this one creates a table

conn.execute('DROP TABLE IF EXISTS Users')
conn.execute('DROP TABLE IF EXISTS Admins')
conn.execute('DROP TABLE IF EXISTS Passwords')
conn.execute('DROP TABLE IF EXISTS appointments')
conn.execute('DROP TABLE IF EXISTS Profiles')


conn.execute('CREATE TABLE Users (Name TEXT, Email TEXT, PRIMARY KEY(Email) )')

conn.execute('CREATE TABLE Admins (Name TEXT, Email TEXT, PRIMARY KEY(Email) )')

conn.execute('CREATE TABLE Passwords (Email TEXT, Password TEXT, PRIMARY KEY(Email) )')

appointments = """
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    date DATE NOT NULL,
    client_email TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    provider_email TEXT NOT NULL ,
    location TEXT,
    notes TEXT
)"""


conn.execute(appointments)


profiles = """
CREATE TABLE Profiles (
    Email TEXT NOT NULL PRIMARY KEY,    
    Name TEXT NOT NULL,
    Biography TEXT,
    State TEXT,
    Gender TEXT, 
    HasLCPC BOOLEAN DEFAULT(FALSE),
    HasLMHC BOOLEAN DEFAULT(FALSE),
    HasLPC BOOLEAN DEFAULT(FALSE),
    HasMD BOOLEAN DEFAULT(FALSE),
    HasNP BOOLEAN DEFAULT(FALSE),
    HasPHD BOOLEAN DEFAULT(FALSE),
    HasPsyD BOOLEAN DEFAULT(FALSE),
    HasAngerManagementSpecialty BOOLEAN DEFAULT(FALSE),
    HasAnxietySpecialty BOOLEAN DEFAULT(FALSE),
    HasEatingSpecialty BOOLEAN DEFAULT(FALSE),
    HasMoodSpecialty BOOLEAN DEFAULT(FALSE),
    HasPersonalitySpecialty BOOLEAN DEFAULT(FALSE),
    HasPTSDSpecialty BOOLEAN DEFAULT(FALSE),
    HasPsychoticSpecialty BOOLEAN DEFAULT(FALSE),
    HasRelationshipSpecialty BOOLEAN DEFAULT(FALSE)
)"""

conn.execute(profiles)

print("Created profile table")

print ("Table created successfully")

# close the connection.
conn.close()