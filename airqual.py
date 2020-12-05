from haversine import haversine
import numpy as np
from math import radians
from time import sleep

import requests
from dotenv import load_dotenv
import os
load_dotenv()

IQAIR_API_KEY = os.getenv("IQAIR_API_KEY")


def get_aq(lat, long):
    slat = str(lat)
    slong = str(long)

    url = "http://api.airvisual.com/v2/nearest_city?lat=" + slat + "&lon=" + slong + "&key=" + IQAIR_API_KEY
    response = requests.get(url)
    airqual = response.json()["data"]["current"]["pollution"]["aqius"]

    return airqual

def cost(lat_long, km_per=1):
    polsum = 0
    for i in range(len(lat_long) - 1):
        distance = haversine((radians(lat_long[i][0]), radians(lat_long[i][1])), (radians(lat_long[i+1][0]), radians(lat_long[i+1][1])))
        pts = int(np.floor(distance / km_per))
        if pts < 2: pts = 2
        lats = np.linspace(lat_long[i][0], lat_long[i][0], pts)
        longs = np.linspace(lat_long[i][1], lat_long[i][1], pts)
        polsum_local = 0
        for j in range(len(lats)):
            added_v = get_aq(lats[j], longs[j]) * distance / pts
            if j == 0 or j == len(lats) - 1: added_v = added_v / 2.0
            polsum_local = polsum_local + added_v
            sleep(0.1)
        polsum = polsum + polsum_local
    return polsum