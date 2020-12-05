from flask import Flask, jsonify, request
from routes import getRoutes
from airqual import cost


app = Flask(__name__)


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

@app.route('/test')
def test():
    latlng = getRoutes('ChIJpTvG15DL1IkRd8S0KlBVNTI','ChIJDbdkHFQayUwR7-8fITgxTmU')
    costs = cost(latlng)
    print(costs)
    return 'done'

# print("don't go outside")