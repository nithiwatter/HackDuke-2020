from haversine import haversine
import numpy as np
from math import radians
from time import sleep

import requests
# from main import IQAIR_API_KEY

def get_aq(lat, long):
    return 5
    slat = str(lat)
    slong = str(long)

    url = "http://api.airvisual.com/v2/nearest_city?lat=" + slat + "&lon=" + slong + "&key=" + IQAIR_API_KEY
    response = requests.get(url);
    airqual = response.json()["data"]["current"]["pollution"]["aqius"]

    # return airqual

def get_other_shit(lat, long):
    return 5

def cost(lats_longs, funcs, weights, km_per=10):
    costs = np.empty([len(lats_longs), len(funcs)])
    index = 0
    for lat_long in lats_longs:
        polsum = np.zeros(len(funcs))
        for i in range(len(lat_long) - 1):
            distance = haversine((lat_long[i][0], lat_long[i][1]), (lat_long[i+1][0], lat_long[i+1][1]))
            pts = int(np.floor(distance / km_per))
            if pts < 2: pts = 2
            lats = np.linspace(lat_long[i][0], lat_long[i][0], pts)
            longs = np.linspace(lat_long[i][1], lat_long[i][1], pts)
            polsum_local = np.zeros(len(funcs))
            last_add = 0
            for j in range(len(lats)):
                added_v = np.empty([len(funcs)])
                for f in range(len(funcs)):
                    new_add = funcs[f](lats[j], longs[j])
                    if new_add == -1:
                        added_v[f] = last_add
                    else:
                        added_v[f] = new_add * distance / pts
                    last_add = added_v[f]
                    if j == 0 or j == len(lats) - 1: added_v[f] = added_v[f] / 2.0
                polsum_local = polsum_local + added_v
                sleep(0.11)
            polsum = polsum + polsum_local
        costs[index] = polsum
        index = index + 1
    maxes = np.amax(costs, axis=0)
    mins = np.amin(costs, axis=0)
    ranges = maxes - mins

    for q in range(len(costs)):
        costs[q] = (costs[q] - mins) / (ranges + 0.01)

    real_costs = np.matmul(costs, weights)
    return real_costs.tolist().index(min(real_costs))

print(cost(np.array([[[0, 0], [1, 1]], [[0, 0], [1, 0], [1, 1]]]), np.array([get_aq, get_other_shit]), np.array([0.5, 0.5])))