import requests

from main import IQAIR_API_KEY


def get_aq(lat, long):
    slat = str(lat)
    slong = str(long)

    url = "http://api.airvisual.com/v2/nearest_city?lat=" + slat + "&lon=" + slong + "&key=" + IQAIR_API_KEY
    response = requests.get(url);
    airqual = response.json()["data"]["current"]["pollution"]["aqius"]

    return airqual