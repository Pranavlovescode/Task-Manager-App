from flask import Flask, render_template, request, redirect, jsonify
from pymongo import MongoClient
from datetime import datetime
from bson import json_util
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load MongoDB URI from environment variables
mongo_uri = os.getenv("MONGO_URI")

# Debugging statement to check if the environment variable is loaded


if not mongo_uri:
    raise ValueError("No MONGO_URI environment variable set. Please set it in your .env file.")

try:
    # Create a MongoClient instance
    client = MongoClient(mongo_uri)
    db = client.get_database("db")
    # Test connection to the database
    db.command("ping")
    print("Database connection initialized successfully")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    db = None

@app.route("/submit", methods=['GET', 'POST'])
def create_data():
    

    latest_todo = db.todos.find_one(sort=[("serial_no", -1)])

    if latest_todo:
        latest_serial_no = latest_todo.get("serial_no", 0)
        serial_no = latest_serial_no + 1
    else:
        serial_no = 1
    
    if request.method == 'POST':
        title = request.form['title']
        desc = request.form['desc']
        current_date = datetime.today()
        db.todos.insert_one({
            'title': title,
            'desc': desc,
            'date_created': current_date,
            'serial_no': serial_no
        })
        return redirect('/')
      
    # return render_template('submit.html')

@app.route('/delete/<int:serial_no>')
def delete_todo(serial_no):  

    db.todos.delete_one({"serial_no": serial_no})
    print('Deleting the data')
    return redirect('/')

@app.route('/update/<int:serial_no>', methods=['GET', 'POST'])
def update_todo(serial_no):  

    element = db.todos.find_one({"serial_no": serial_no})
    if request.method == 'POST':
        updated_title = request.form['title']
        updated_desc = request.form['desc']
        updated_date = datetime.today()
        
        db.todos.update_one({"serial_no": serial_no}, {
            "$set": {
                "title": updated_title,
                "desc": updated_desc,
                "date_created": updated_date
            }
        })
        return redirect('/')
    
    return jsonify(element)

@app.route('/search', methods=['GET', 'POST'])
def search_todo(): 
    
    search = request.form.get('search', '').lower()
    print(f"Search query: {search}")
    results = list(db.todos.find({"title": {"$regex": f"^{search}", "$options": "i"}}))
    print(f"Number of results: {len(results)}")
    serialized_results = json_util.dumps(results)
    return serialized_results
    
@app.route('/')
def landing_page():  

    all_todo = list(db.todos.find({}))
    print(all_todo)
    return jsonify(all_todo)

@app.route('/about')
def about_page():
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True, port=8000)
