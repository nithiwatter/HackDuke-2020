import numpy as np
import requests
import os

MAPS_API_KEY = os.getenv("MAPS_API_KEY")
data = np.genfromtxt('example_data.csv',dtype='U',delimiter=',',skip_header=1)

def getAddresses():
    addresses = []
    for i in range(len(data)):
        addresses.append(data[i][1])
    return addresses

#print(addresses)

def getData():
    output = np.zeros((len(data),4))
    for j in range(len(data)):
        output[j]=[data[j][0], data[j][3], data[j][4], data[j][2]]
    return output


def get_coords(addrs):
    ret = np.zeros(len(addrs) * 2)
    for k in range(0, len(addrs)):
        url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + addrs[k] + "&key=" + MAPS_API_KEY
        response = requests.get(url)
        lat = response.json()["results"][0]["geometry"]["location"]["lat"]
        long = response.json()["results"][0]["geometry"]["location"]["lng"]

        ret[2 * k] = lat
        ret[2 * k + 1] = long

    ret2 = np.reshape(ret, (len(addrs), 2))
    return ret2

# print(output)

# if __name__ == "__main__":
#     print(getAddresses())
#     print(getData())