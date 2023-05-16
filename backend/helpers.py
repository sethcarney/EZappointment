import sqlite3 as sql
from flask import jsonify
import bcrypt

def checkAdminStatus(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            query = "SELECT Name FROM Admins WHERE Email = '"+email+"'"
            cur.execute(query)  
            result = cur.fetchone()
            
            if result != None:
                return True
            else:
                query = "SELECT Name FROM Users WHERE Users.Email = '"+email+"'"
                cur.execute(query)  
                result = cur.fetchone()
                
                if result != None:
                    return False
                else:
                     return jsonify({"msg": "Error getting profile information"}), 401
        
    except:
        con.rollback()
        return jsonify({"msg": "Error getting profile information"}), 401
        
    finally:
        con.close()



def getName(email):
    try:
        with sql.connect("database.db") as con:
            query = "SELECT * FROM Admins WHERE Admins.Email = '"+email+"'"
            cur = con.cursor()
            cur.execute(query)  
            result = cur.fetchone()
            
            if result != None:
                return result[0]
            
            # check Users table for name
            query = "SELECT * FROM Users WHERE Users.Email = '"+email+"'"
            cur.execute(query)  
            result = cur.fetchone()
            
            if result != None:
                return result[0]
            
            return "Error"
            
    except:
        con.rollback()
        return "Error"

    finally:
        con.close()

def getUserType(email):
    try:
        with sql.connect("database.db") as con:
            query = "SELECT 1 FROM Admins WHERE Admins.Email = '"+email+"'"
            cur = con.cursor()
            cur.execute(query)  
            result = cur.fetchone()
            
            if result != None:
                return "Provider"
            else:
                return "Patient"
    except:
        con.rollback()
        return "Error"

    finally:
        con.close()

def get_hashed_password(password):
    # Hash a password for the first time
    #   (Using bcrypt, the salt is saved into the hash itself)    
    # converting password to array of bytes
    bytes = password.encode('utf-8')
    # generating the salt
    salt = bcrypt.gensalt()
    # Hashing the password
    return bcrypt.hashpw(bytes, salt)

def check_password(plain_text_password, hashed_password):
    # Check hashed password. Using bcrypt, the salt is saved into the hash itself
      # Taking user entered password 
    
    # checking password
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_password)