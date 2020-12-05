from flask import Flask, jsonify, request
from routes import getRoutes
from test import get_aq, cost


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
    costs = cost(latlng, [get_aq], [1])
    return jsonify(airqual_costs=costs)

@app.route('/test')
def test():
    latlng = getRoutes('ChIJpTvG15DL1IkRd8S0KlBVNTI','ChIJDbdkHFQayUwR7-8fITgxTmU')
    # print(latlng)
    costs = cost(latlng,[get_aq],[1])
    print(costs)
    return 'done'

# print("don't go outside")