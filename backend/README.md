
### Note 
I recommend adding a SQLite extension pack from VSCODE to view the database.db file


### Backend Setup Below

The following database has been created using sqlite3 and python


### Dependencies:
To ensure you have the correct environment run the following command from within the backend directory

pip install -r requirements.txt


### The following commands must be executed in the backend directory

### To build your database.db file (only needed once)
run the following command in your terminal from the "backend" directory

python setup.py

### Run backend server

python app.py

OR

./startup.sh

### Details
All code regarding requests to the backend server are located in the app.py file
All tables within the database are initialized in the setup.py file



