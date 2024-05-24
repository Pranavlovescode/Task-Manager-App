from flask import Flask, render_template, request, redirect, jsonify
from pymongo import MongoClient
from datetime import datetime
from bson import json_util
import os
from dotenv import load_dotenv
from flask_cors import CORS
import json
from bson import ObjectId

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load MongoDB URI from environment variables
mongo_uri = os.getenv("MONGO_URI")

# Custom JSON encoder to handle ObjectId serialization
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

app.json_encoder = CustomJSONEncoder

if not mongo_uri:
    raise ValueError("No MONGO_URI environment variable set. Please set it in your .env file.")

try:
    # Create a MongoClient instance
    client = MongoClient(mongo_uri)
    db = client.get_database("todos")
    # Test connection to the database
    db.command("ping")
    print("Database connection initialized successfully")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    db = None

@app.route("/submit", methods=['GET', 'POST'])
def create_data():
    if request.method == 'POST':
        latest_todo = db.todos.find_one(sort=[("serial_no", -1)])
        if latest_todo:
            latest_serial_no = latest_todo.get("serial_no", 0)
            serial_no = latest_serial_no + 1
        else:
            serial_no = 1

        title = request.json.get('task_name')
        desc = request.json.get('desc')
        end_time = request.json.get('end_time')
        email = request.json.get('email')
        current_date = datetime.today()

        db.todos.insert_one({
            'serial_no': serial_no,
            'title': title,
            'desc': desc,
            'date_created': current_date,
            'end_time': end_time,
            'email': email,
        })
        return {'message': 'Data added successfully'}

    return {'message': 'Data added successfully'}

@app.route('/delete/<int:serial_no>',methods=['DELETE'])
def delete_todo(serial_no):
    db.todos.delete_one({"serial_no": serial_no})
    print('Deleting the data')
    return {'message': 'Data deleted successfully'}

@app.route('/update/<int:serial_no>', methods=['GET', 'POST'])
def update_todo(serial_no):
    element = db.todos.find_one({"serial_no": serial_no})
    if request.method == 'POST':
        updated_title = request.json.get('task_name')
        updated_desc = request.json.get('desc')
        updated_end_time = request.json.get('end_time')
        updated_date = datetime.today()

        db.todos.update_one({"serial_no": serial_no}, {
            "$set": {
                "title": updated_title,
                "desc": updated_desc,
                "date_created": updated_date,
                "end_time": updated_end_time
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
    return jsonify(serialized_results)

@app.route('/')
def landing_page():
    all_todo = list(db.todos.find({},{ "_id": 0 }))
    print(all_todo)
    return jsonify(all_todo)

@app.route('/about')
def about_page():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True, port=8000)
