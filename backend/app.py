""" A simple flask example to greet a user
"""
from flask import Flask, render_template, request, redirect, json, jsonify
import sqlite3 as sql
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from datetime import date
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token
from flask_jwt_extended import unset_jwt_cookies
from flask_jwt_extended import get_jwt
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from helpers import *
# Set up the flask constructor with the module name as the parameter
app = Flask(__name__)
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "mind-match-super-secret-key"

# Authentication token set to expire after 1 hour
ACCESS_EXPIRES = timedelta(hours=1)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES
jwt = JWTManager(app)




    
# Serve React App

@app.route('/', methods=['POST', 'GET'])
def home():
    return "Mind Match Server Page"


# This will be called if the user hits Submit on student.html
# The request object contains the form dict with the filed names as 
# the keys and the input data as values
@app.route('/addUser', methods=['POST'])
def addUser():
    try:
        name = request.json.get("name", None)
        email = request.json.get("email", None)
        password = request.json.get("password", None)
        userType = request.json.get("usertype")
        
        # connect to the ./database and aquire a "cursor"
        with sql.connect("database.db") as con:
            cur = con.cursor()
            
            # Check if email already exists. If so, do not allow
            # creation of a new user
            query = "SELECT * FROM Passwords WHERE Passwords.Email = '"+email+"'"
            cur.execute(query)  
            result = cur.fetchone()
            
            if result != None:
                return jsonify({"msg": "Email already exists"}), 401
            
            # insert the form values in the ./database
            if userType == True:
                cur.execute('INSERT INTO Admins (Name, Email) VALUES (?, ?)',(name, email))
            else:
                cur.execute('INSERT INTO Users (Name, Email) VALUES (?, ?)',(name, email))

            # create a profile entry
            cur.execute('INSERT INTO Profiles (Email, Name) VALUES (?, ?)', (email, name))
            
            password = get_hashed_password(password)
            cur.execute('INSERT INTO Passwords (Email, Password) VALUES (?, ?)',(email, password))
            con.commit()
            return jsonify({"msg": "Account created"}), 200
    except Exception as e:
        con.rollback()
        return jsonify({"msg": "Error in registration system"}), 401

    finally:    
        con.close()


# Using an `after_request` callback, we refresh any token that is within 30
# minutes of expiring. Change the timedeltas to match the needs of your application.
# More about token refresh: https://flask-jwt-extended.readthedocs.io/en/stable/refreshing_tokens/
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            # Add the new access token in the response
            data = response.get_json()
            print(data)
            #data['access_token'] = access_token
            if type(data) == list:
                data.append(access_token)
            else:
                data["access_token"] = access_token
            response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response
 
    
# The login route will authenticate users and return JWTs. The
# create_access_token() function is used to actually generate the JWT (aka token).
@app.route('/login', methods=['POST'])
def login():

    if request.method == 'POST':
        email = request.json.get("email", None)
        password = request.json.get("password", None)
        
        try:
            with sql.connect("./database.db") as con:
                query = "SELECT Passwords.Password FROM Passwords WHERE Passwords.Email = '"+email+"' AND ( EXISTS (SELECT 1 FROM Users WHERE Users.Email = Passwords.Email) OR EXISTS (SELECT 1 FROM Admins WHERE Admins.Email = Passwords.Email))"
                cur = con.cursor()
                cur.execute(query)  
                storedPW = cur.fetchone()
                
                if storedPW != None:
                    if check_password(password, storedPW[0]): 
                        access_token = create_access_token(identity=email)
                        return jsonify({'access_token': access_token,
                                        'usertype': getUserType(email),
                                        'username': getName(email)}), 200
                    else:
                        return jsonify({"msg": "Bad username or password"}), 401
                else:
                    return jsonify({"msg": "Bad username or password"}), 401
        except:
            con.rollback()
            return jsonify({"msg": "Error in login authentication system"}), 401

        finally:
            con.close()
        

    



# This will be used to get a user's profile information
@app.route('/profile', methods=['GET'])
@jwt_required()
def getProfile():
    try:
        email = get_jwt_identity()
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute("SELECT * FROM Profiles WHERE Email = ?", (email,))  
            result = cur.fetchone()
            
            if result != None:
                return jsonify(result), 200
            else:
                return jsonify({"msg": "No results"}), 401
        
    except:
        con.rollback()
        return jsonify({"msg": "Error getting profile information"}), 401
        
    finally:
        con.close()


@app.route('/setProfile', methods=['POST'])
@jwt_required()
def setProfile():
    try:
       email = request.json.get("email", None)
       name = request.json.get("name", None)
       password = request.json.get("password", None)
       biography = request.json.get("biography", None)
       state = request.json.get("state", None)
       gender = request.json.get("gender", None)
       LCPC = request.json.get("LCPC", None)
       LMHC = request.json.get("LMHC", None)
       LPC = request.json.get("LPC", None)
       MD = request.json.get("MD", None)
       NP = request.json.get("NP", None)
       PHD = request.json.get("PHD", None)
       PsyD = request.json.get("PsyD", None)
       AngerManagementSpecialty = request.json.get("AngerManagementSpecialty", None)
       AnxietySpecialty = request.json.get("AnxietySpecialty", None)
       EatingSpecialty = request.json.get("EatingSpecialty", None) 
       MoodSpecialty = request.json.get("MoodSpecialty", None)
       PersonalitySpecialty = request.json.get("PersonalitySpecialty", None)
       PTSDSpecialty = request.json.get("PTSDSpecialty", None)
       PsychoticSpecialty = request.json.get("PsychoticSpecialty", None)
       RelationshipSpecialty = request.json.get("RelationshipSpecialty", None)
       
       with sql.connect("database.db") as con:
            cur = con.cursor() 
            
            #Check password update
            if password != "":    
                encrypted_password = get_hashed_password(password)
                cur.execute("UPDATE Passwords SET Password = ? WHERE Email = ?", (encrypted_password, email))
                con.commit()
                
                
            #Update profile information
            cur.execute("""UPDATE Profiles SET 
                Name = ?, Biography = ?,
                State = ?, Gender = ?, HasLCPC = ?,
                HasLMHC = ?, HasLPC = ?,
                HasMD = ?, HasNP = ?,
                HasPHD = ?, HasPsyD = ?,
                HasAngerManagementSpecialty = ?,
                HasAnxietySpecialty = ?,
                HasEatingSpecialty = ?,
                HasMoodSpecialty = ?,
                HasPersonalitySpecialty = ?,
                HasPTSDSpecialty = ?,
                HasPsychoticSpecialty = ?,
                HasRelationshipSpecialty = ?
                WHERE Email = ?""", 
                (name, biography, state, gender,
                LCPC, LMHC, LPC, MD,
                NP, PHD, PsyD, 
                AngerManagementSpecialty,
                AnxietySpecialty,
                EatingSpecialty, 
                MoodSpecialty, 
                PersonalitySpecialty,
                PTSDSpecialty,
                PsychoticSpecialty,
                RelationshipSpecialty,
                email))
            
            # Update Name throughout all tables
            if name != None and name != "" and getUserType(email) == "Provider":
                cur.execute("UPDATE Admins SET Name = ? WHERE Email = ?", (name, email))
                cur.execute("UPDATE appointments SET provider_name = ? WHERE provider_email = ?", (name, email))
            
            if name != None and name != "" and getUserType(email) == "Patient":
                cur.execute("UPDATE Users SET Name = ? WHERE Email = ?", (name, email))                
                
       return jsonify({"msg": "Successfully updated profile"}), 200
 
    except:
       con.rollback()
       return jsonify({'msg': "Error updating profile"}), 401
   
    finally:
       con.commit()
       con.close() 
  
# This will be used to get a provider's profile information for booking
@app.route('/getProviderProfile', methods=['POST'])
@jwt_required()
def getProviderProfile():
    try:
        email = request.json.get("email", None)
        
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute("SELECT * FROM Profiles WHERE Email = ?", (email,))  
            result = cur.fetchone()
            
            if result != None:
                return jsonify(result), 200
            else:
                return jsonify({"msg": "No results"}), 401
        
    except:
        con.rollback()
        return jsonify({"msg": "Error getting profile information"}), 401
        
    finally:
        con.close()  
       

@app.route('/scheduleAppointment', methods=['POST'])
@jwt_required()
def scheduleAppointment():
    if request.method == 'POST':
        try:
            email = get_jwt_identity()
            #id should be the id of the appointment
            id = request.json[0]
            with sql.connect("database.db") as conn:
                cursor = conn.cursor()
                if checkAdminStatus(email) == False:
                    cursor.execute("UPDATE appointments SET client_email = ? WHERE id = ?", (email,id))
                else:
                    cursor.execute("UPDATE appointments SET client_email = ? WHERE id = ?", (request.json[1]), id)
                conn.commit()
                return jsonify({ "msg": "Appointment scheduled successfully"}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({ "msg": "Error in query operation  "+ str(e)}), 401
        finally:
            cursor.close()
            conn.close()
    else:
        return jsonify({ "msg": "Error in query operation"}), 401

@app.route('/setSchedule', methods=['POST', 'GET'])
@jwt_required()   
def setSchedule():
    if request.method == 'POST':
        try:
            # Grab the schedule data
            schedule_data = [
                ('Monday', request.json.get('monday_start'), request.json.get('monday_end')),
                ('Tuesday', request.json.get('tuesday_start'), request.json.get('tuesday_end')),
                ('Wednesday', request.json.get('wednesday_start'), request.json.get('wednesday_end')),
                ('Thursday', request.json.get('thursday_start'), request.json.get('thursday_end')),
                ('Friday', request.json.get('friday_start'), request.json.get('friday_end')),
                ('Saturday', request.json.get('saturday_start'), request.json.get('saturday_end')),
                ('Sunday', request.json.get('sunday_start'), request.json.get('sunday_end'))
            ]
            
            # Define the start date and number of weeks
            with sql.connect("database.db") as conn:
                cursor = conn.cursor()
                today = date.today()
                email = get_jwt_identity()
                name = getName(email)
                duration = int(request.json.get('duration_length'))
                # calculate the date of the next monday
                monday = today + timedelta(days=(7 - today.weekday()) % 7)
                
                # Loop through the schedule data and insert appointments for the specified number of weeks
                # Generate appointments for each week
                for i in range(int(request.json.get('numweeks'))):
                    for day, start_time, end_time in schedule_data:
                        if start_time and end_time:
                            # Determine the date for this day of the week
                            currentdate = monday + timedelta(days=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].index(day))
                            # Check if appointment already exists for this date, start time, and end time
                            
                            print("Converting start and end to datetime")
                            # Create timeslots given a starting and ending availability
                            start = datetime.strptime(start_time,'%H:%M')
                            end = datetime.strptime(end_time,'%H:%M')
                            timeslots = []
                            
                            print("Going to create timeslots")
                            temp = start
                            while temp + timedelta(minutes=duration) <= end:
                                print(temp.time())
                                timeslots.append([temp.time(), (temp + timedelta(minutes=duration)).time()])
                                temp = temp + timedelta(minutes=duration)
                            print("Finished creating timeslots")
                            
                            for j in range(len(timeslots)):
                                print(j)
                                print("Going to execute first query")
                                cursor.execute(
                                    """
                                    SELECT * FROM appointments WHERE date=? AND start_time=? AND end_time=?
                                    """,
                                    (currentdate, currentdate.strftime('%Y-%m-%d') + ' ' + timeslots[j][0].strftime("%H:%M:%S"), currentdate.strftime('%Y-%m-%d') + ' ' + timeslots[j][1].strftime("%H:%M:%S"))
                                )
                                print("Finished executing first query")
                                appointment = cursor.fetchone()
                                if appointment:
                                    # If appointment already exists, skip this iteration
                                    continue
                                # Insert the appointment into the appointments table
                                print("Going to insert into appointments table")
                                print(currentdate.strftime('%Y-%m-%d') + ' ' + timeslots[j][0].strftime("%H:%M:%S"))
                                print(currentdate.strftime('%Y-%m-%d') + ' ' + timeslots[j][1].strftime("%H:%M:%S"))
                                print(currentdate)
                                print(name)
                                print(email)
                                cursor.execute(
                                    """
                                    INSERT INTO appointments (start_time, end_time, date, client_email, provider_name, provider_email, location, notes)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                                    """, 
                                    ((currentdate.strftime('%Y-%m-%d') + ' ' + timeslots[j][0].strftime("%H:%M:%S")), (currentdate.strftime('%Y-%m-%d') + ' ' + timeslots[j][1].strftime("%H:%M:%S")), currentdate, '', name, email, 'N/A', 'N/A')
                                )
                                print("Finished executing in appointments table")
                            # Commit the transaction
                            conn.commit()
                    monday += timedelta(days=7)

            return jsonify({ 
                "msg": "Database updated successfully"
            }), 200
        except Exception as e:
            conn.rollback()
            print("Error: ", e)
            return jsonify({ "msg": "Error in query operation  "+ str(e)}), 401
        finally:
            cursor.close()
            conn.close()
            
                   
 
@app.route('/getSchedule', methods=['GET'])
@jwt_required()
def getSchedule():
    if request.method == 'GET':
        try:
            email = get_jwt_identity()
            if checkAdminStatus(email):
                with sql.connect("database.db") as conn:
                    cursor = conn.cursor()
                    cursor.execute("SELECT * FROM appointments WHERE provider_email = ?", (email,))
                    rows = cursor.fetchall()
                
                    # filter out free appointments
                    filtered_rows = []
                    for i in range(len(rows)):
                        if rows[i][4] != '':
                            filtered_rows.append(list(rows[i]))
                            filtered_rows[len(filtered_rows) - 1][4] = getName(filtered_rows[len(filtered_rows) - 1][4])
                        
                    print(filtered_rows)
                    return jsonify(filtered_rows), 200
            # If the user is not an admin, get the free appointments for the admin selected
            else:
                with sql.connect("database.db") as conn:
                    cursor = conn.cursor()
                    #if no provider specified, return all free appointments
                    cursor.execute("SELECT * FROM appointments WHERE client_email = ?", (email,))
                    rows = cursor.fetchall()
                    return jsonify(rows), 200
        except Exception as e:
            conn.rollback()
            return jsonify({ "msg": "Error in query operation  "+ str(e)}), 401
        finally:
            cursor.close()
            conn.close()
    else:
        return jsonify({ "msg": "Error in query operation"}), 401

@app.route('/getAvailability', methods=['GET'])
@jwt_required()
def getAvailability():
    if request.method == 'GET':
        try:
            email = get_jwt_identity()
            if checkAdminStatus(email) == False:
                with sql.connect("database.db") as conn:
                    cursor = conn.cursor()
                    #if no provider specified, return all free appointments
                    if request.args.get('provider_email') != None:
                        cursor.execute("SELECT * FROM appointments WHERE provider_email = ? AND client_email = ''", (request.args.get('provider_email'),))
                    else:
                        cursor.execute("SELECT * FROM appointments WHERE client_email = ''")
                    rows = cursor.fetchall()
            else:
                with sql.connect("database.db") as conn:
                    cursor = conn.cursor()
                    #if no provider specified, return all free appointments
                    cursor.execute("SELECT * FROM appointments WHERE provider_email = ? AND client_email = ''", (email,))
                    rows = cursor.fetchall()
            return jsonify(rows), 200
        except Exception as e:
            conn.rollback()
            return jsonify({ "msg": "Error in query operation  "+ str(e)}), 401
        finally:
            cursor.close()
            conn.close()
    else:
        return jsonify({ "msg": "Error in query operation"}), 401
    
# This route is for getting timeslots to show to clients on the search page
@app.route('/getTimeslots', methods=['POST'])
@jwt_required()
def getTimeslots():
    client_email = get_jwt_identity()
    try:
        with sql.connect("database.db") as con:
            cursor = con.cursor()
            cursor.execute("SELECT State FROM Profiles WHERE Email = ?", (client_email,))
            client_state = cursor.fetchall()
            print("Client state: ", client_state[0][0])
            
            cursor.execute("SELECT * FROM appointments WHERE client_email = '' ORDER BY provider_email, start_time")
            result = cursor.fetchall()
            print("The result is: ", result)
            filtered_results = []
            
            # filter out appointments that have already passed and
            # providers who are not in the client's state
            for i in range(len(result)):
                provider_email = result[i][6]
                cursor.execute("SELECT State FROM Profiles WHERE Email = ?", (provider_email,))
                provider_state = cursor.fetchall()
                print("Provider state: ", provider_state[0][0])
                
                if (datetime.strptime(result[i][1], '%Y-%m-%d %H:%M:%S') > datetime.now() and client_state == provider_state):
                    filtered_results.append(result[i])
                
            return jsonify(filtered_results), 200
    except Exception as e:
        con.rollback()
        print("Error: ", e)
        return jsonify({"msg": "Error fetching timeslots"}), 401
    finally:
        con.close()

# This route is to check if an appointment has not already booked during the booking phase
@app.route('/checkAppointment', methods=['POST'])
@jwt_required()
def checkAppointment():
    provider_email = request.json.get("email", None)
    start_time = request.json.get("time", None)
    
    try:
        with sql.connect("database.db") as con:
            cursor = con.cursor()
            cursor.execute("SELECT * FROM appointments WHERE provider_email = ? AND client_email = '' AND start_time = ?", (provider_email, start_time))
            result = cursor.fetchall()
            print(result)
            
            if result != []:
                return jsonify({'msg': 'Free Appointment'}), 200
            else:
                return jsonify({'msg': 'Booked Appointment'}), 200
    except Exception as e:
        print("Error: ", e)
        return jsonify({"msg": "Error checking timeslot"}), 401
    finally:
        con.close()
        
        
@app.route('/bookAppointment', methods=['POST'])
@jwt_required()
def bookAppointment():
    provider_email = request.json.get("email", None)
    start_time = request.json.get("time", None)
    client_email = get_jwt_identity()
    
    try:
        with sql.connect("database.db") as con:    
            cursor = con.cursor()
            cursor.execute("UPDATE appointments SET client_email = ? WHERE provider_email = ? AND start_time = ?", (client_email, provider_email, start_time))
            con.commit()
            return jsonify({"msg": "Successfully booked appointment"}), 200
    except Exception as e:
        print("Error: ", e)
        con.rollback()
        return jsonify({"msg": "Error booking appointment"}), 401
        
    finally:
        con.close()
    

@app.route('/cancelAppointment', methods=['POST'])
@jwt_required()
def cancelAppointment():
    if request.method == 'POST':
        
            email = get_jwt_identity()
            id = request.json.get("id", None)
            try:
                with sql.connect("database.db") as conn:
            
                    cursor = conn.cursor()
                    if checkAdminStatus(email):   
                        cursor.execute("DELETE FROM appointments WHERE id = ?", (id,))
                        conn.commit()
                    else:
                        cursor.execute("UPDATE appointments SET client_email = '' WHERE id = ?", (id,))
                        conn.commit()
                    return jsonify({ "msg": "Appointment cancelled successfully"}), 200
            except Exception as e:
                conn.rollback()
                return jsonify({ "msg": "Error in query operation  "+ str(e)}), 401
            finally:
                    
                conn.close()
    else:
        return jsonify({ "msg": "Error in query operation"}), 401
    

@app.route('/editAppointment', methods=['POST'])
@jwt_required()
def editAppointment():
    id = request.json.get("id", None)
    location = request.json.get("location", None)
    notes = request.json.get("notes", None)
    print("Location:", location)
    print("Notes:", notes)
    print("Id:", id)
            
    try:
        with sql.connect("database.db") as conn:
            cursor = conn.cursor() 
            cursor.execute("UPDATE appointments SET location = ?, notes = ? WHERE id = ?", (location, notes, id))
            conn.commit()
            return jsonify({ "msg": "Appointment updated successfully"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({ "msg": "Error in query operation  "+ str(e)}), 401
    finally:      
        conn.close()

@app.route('/getUserCredentials', methods=["GET"])
@jwt_required()
def getUserCredentials():
    email = get_jwt_identity()
    userType = getUserType(email)
    userName = getName(email)
    
    if(userType == "Error" or userName == "Error"):
        return jsonify({"msg": "Error getting user credentials"}), 401
    
    return jsonify({
                    "msg": "Successfully obtained user credentials",
                    "userType": userType,
                    "userName": userName
                }), 200

@app.route('/logout', methods=["POST"])
@jwt_required()   
def logout():
    response = jsonify({"msg": "User logged out successfully"})
    return response







# launch the app
if __name__ == "__main__":
    app.run(debug=True, port=5000)