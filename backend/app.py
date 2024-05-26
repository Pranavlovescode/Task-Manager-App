from flask import Flask, render_template, request, redirect, jsonify
from pymongo import MongoClient
from datetime import datetime
from bson import json_util
import os
from dotenv import load_dotenv
from flask_cors import CORS
import json
from bson import ObjectId
from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASS')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('EMAIL_USER')


# Scheduler configuration
mail = Mail(app)
scheduler = BackgroundScheduler()
scheduler.start()

# Load MongoDB URI from environment variables
mongo_uri = os.getenv("MONGO_URI")

# Custom JSON encoder to handle ObjectId serialization
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

app.json_encoder = CustomJSONEncoder

tasks = []

def send_email(recipient, task_name, desc):
    with app.app_context():
        msg = Message(f'Reminder: {task_name} is due soon!',recipients=[recipient])
        msg.body = f'Task "{task_name}" is due in 1 hour.\n\nDescription:\n{desc}.\nAfter completion, please delete the task from the app.\n If not completed, the task will be deleted automatically.\n\nThank you!'
        mail.send(msg)

def delete_task(serial_no):
    db.todos.delete_one({"serial_no": serial_no})
    print('Deleting the data')

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
        end_date = request.json.get('end_date')
        email = request.json.get('email')
        current_date = datetime.today()
        updated_end_time = datetime.strptime(f"{end_date} {end_time}", '%Y-%m-%d %H:%M')
        db.todos.insert_one({
            'serial_no': serial_no,
            'title': title,
            'desc': desc,
            'date_created': current_date,
            'end_time': updated_end_time,
            'email': email,
        })
        task = {
            'title': title,
            'email': email,
            'end_time': updated_end_time,
            'desc': desc,
            'serial_no': serial_no
        }
        tasks.append(task)

        # Schedule the email to be sent 1 hour before the end time
        scheduler.add_job(send_email, 'date', run_date=updated_end_time - timedelta(hours=1), args=[task['email'], task['title'], task['desc']])

        # Schedule task deletion at the end time
        scheduler.add_job(delete_task, 'date', run_date=updated_end_time, args=[task['serial_no']])

        return {'message': 'Task added and email scheduled successfully'}

    return {'message': 'Task added and email scheduled successfully'}

@app.route('/delete/<int:serial_no>',methods=['DELETE'])
def delete_todo(serial_no):
    db.todos.delete_one({"serial_no": serial_no})
    print('Deleting the data')
    return {'message': 'Data deleted successfully'}

@app.route('/update/<int:serial_no>', methods=['GET', 'POST'])
def update_todo(serial_no):
    element = db.todos.find_one({"serial_no": serial_no})
    if request.method == 'POST':
        updated_title = request.json.get('title')
        updated_desc = request.json.get('desc')
        updated_end_time = request.json.get('end_time')
        updated_end_date = request.json.get('end_date')
        updated_email = request.json.get('email')
        updated_date = datetime.today()
        updated_total_time = datetime.strptime(f"{updated_end_date} {updated_end_time}", '%Y-%m-%d %H:%M')
        print(f"Updated total time: {updated_total_time}")
        db.todos.update_one({"serial_no": serial_no}, {
            "$set": {
                "title": updated_title,
                "desc": updated_desc,
                "date_created": updated_date,
                "end_time": updated_total_time,
                "email": updated_email
            }
        })
        task = {
            'title': updated_title,
            'email': updated_email,
            'end_time': updated_total_time,
            'desc': updated_desc,
            'serial_no': serial_no,            
        }
        tasks.append(task)

        # Schedule the email to be sent 1 hour before the end time
        scheduler.add_job(send_email, 'date', run_date=updated_total_time - timedelta(hours=1), args=[task['email'], task['title'], task['desc']])

        # Schedule task deletion at the end time
        scheduler.add_job(delete_task, 'date', run_date=updated_total_time, args=[task['serial_no']])

        return {'message': 'Data updated successfully and email scheduled successfully'}

    return {'message': 'Data updated successfully and email scheduled successfully'}

@app.route('/search', methods=['GET', 'POST'])
def search_todo():
    search = request.form.get('search', '').lower()
    print(f"Search query: {search}")
    results = list(db.todos.find({"title": {"$regex": f"{search}", "$options": "i"}},{ "_id": 0 }))
    print(f"Number of results: {len(results)}")
    serialized_results = json_util.dumps(results)
    return jsonify(results)

@app.route('/')
def landing_page():
    all_todo = list(db.todos.find({},{ "_id": 0 }))
    print(all_todo)
    return jsonify(all_todo)

@app.route('/about')
def about_page():
    return "This is about page"

if __name__ == '__main__':
    app.run(debug=True, port=8000)
