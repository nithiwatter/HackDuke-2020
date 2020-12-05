from dotenv import load_dotenv
import requests
import os
import json

load_dotenv()

DIRECTIONS_API_KEY = os.getenv("DIRECTIONS_API_KEY")



def getRoutes(origin, destination):

    latlng = []
    legs=[]
    data = requests.get("https://maps.googleapis.com/maps/api/directions/json?origin=place_id:{}&destination=place_id:{}&alternatives=true&key={}".format(origin,destination,DIRECTIONS_API_KEY))
    data = data.json()["routes"]

    for i in data:
        # print(json.dumps(i["legs"][0]["steps"],indent=2))
        legs.append(i["legs"][0]["steps"])

    for j in legs:
        new_list = [k["end_location"] for k in j]
        latlng.append(new_list)
        
    return latlng

# if __name__ == "__main__":
#     getRoutes('ChIJpTvG15DL1IkRd8S0KlBVNTI','ChIJDbdkHFQayUwR7-8fITgxTmU')


