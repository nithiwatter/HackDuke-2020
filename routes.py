from dotenv import load_dotenv
import requests
import os
import json

load_dotenv()

DIRECTIONS_API_KEY = os.getenv("DIRECTIONS_API_KEY")



def getRoutes(origin,destination):

    latlng = []
    data = requests.get("https://maps.googleapis.com/maps/api/directions/json?origin=place_id:{}&destination=place_id{}&key={}".format(origin,destination,DIRECTIONS_API_KEY))
    data = data.json()["routes"][0]["legs"][0]["steps"]

    for loc in data:
        latlng.append(loc["end_location"])

    # print(latlng)
    return latlng

# if __name__ == "__main__":
#     test()


