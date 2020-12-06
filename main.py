from flask import Flask, jsonify, request
from routes import getRoutes
from test import get_aq, cost
from clustering import *
from parsingCSV import *

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
    return jsonify(route=latlng[costs])

@app.route('/test')
def test():
    #montreal/ontario - 'ChIJpTvG15DL1IkRd8S0KlBVNTI','ChIJDbdkHFQayUwR7-8fITgxTmU'
    #duke/unc - 'ChIJfzLrAbLmrIkRjaMc7lUWH7I','ChIJ66oXy9LCrIkR4OCXZJfwO7M'
    latlng = getRoutes('ChIJ66_O8Ra35YgR4sf8ljh9zcQ','ChIJd7zN_thz54gRnr-lPAaywwo')
    #print(latlng)
    costs = cost(latlng,[get_aq],[1])
    print(costs)
    return 'done'

@app.route('/test2')
def test2():
    G = make_G(get_coords(getAddresses()))
    G_prime = make_G_prime(getData(), G)
    print(G_prime)
    W = make_W(G_prime)
    D = make_D(W)
    L = make_L(D, W)
    print(make_clusters(L))
    return 'done'
    # G = make_G(lat_long)
    # G_prime = make_G_prime(students, G)
    # print(G_prime)
    # W = make_W(G_prime)
    # D = make_D(W)
    # L = make_L(D, W)
    # print(make_clusters(L))

# print("don't go outside")