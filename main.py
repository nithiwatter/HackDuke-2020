from flask import Flask, jsonify, request
from routes import getRoutes
from test import get_aq, cost
from clustering import *
from parsingCSV import *
import json

from sklearn.cluster import spectral_clustering

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
    latlng = get_coords(getAddresses())
    G = make_G(latlng)
    G_prime = make_G_prime(getData(), G)
    cluster = spectral_clustering(G_prime, n_clusters=int(len(G_prime) / 3))

    output = dict()

    for i in range(len(cluster)):
        if cluster[i] in output:
            output[cluster[i].item()].append(latlng[i].tolist())
        else:
            output[cluster[i].item()] = [latlng[i].tolist()]
    
    return output


@app.route('/test3')
def test3():
    latlng = get_coords(getAddresses())
    G = make_G(latlng)
    G_prime_prime = make_G_prime_prime(getData(), G, latlng, get_coords(['3812 Hillsboro Pike, Nashville, TN'])[0])
    cluster = spectral_clustering(G_prime_prime, n_clusters=int(len(G_prime_prime) / 3))

    output = dict()

    for i in range(len(cluster)):
        if cluster[i] in output:
            output[cluster[i].item()].append(latlng[i].tolist())
        else:
            output[cluster[i].item()] = [latlng[i].tolist()]

    return output
