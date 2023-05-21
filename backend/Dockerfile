# Use an official Python image as the base
FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file to the working directory
COPY requirements.txt ./

# Install the backend dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code to the working directory
COPY . .

# Expose the port for the Flask server (default is 5000 for Flask apps)
EXPOSE 5000

# Set the command to start the Flask server
CMD python setup.py && python app.py

