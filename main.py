from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
from routes import getRoutes
from airqual import cost


app = Flask(__name__)
load_dotenv()

IQAIR_API_KEY = os.getenv("IQAIR_API_KEY")
DIRECTIONS_API_KEY = os.getenv("DIRECTIONS_API_KEY")
MAPS_API_KEY = os.getenv("MAPS_API_KEY")

@app.route('/')
def index():
    return 'index'


@app.route('/airquality', methods=['POST'])
def airquality():
    req = request.get_json(force=True)
    origin = req[0]['place_id']
    destination = req[1]['place_id']
    latlng = getRoutes(origin, destination)
    costs = cost(latlng)
    return jsonify(airqual_costs=costs)

# print("don't go outside")