import numpy as np

data = np.genfromtxt('Book1.csv',dtype='U',delimiter=',',skip_header=1)

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

# print(output)

# if __name__ == "__main__":
#     print(getAddresses())
#     print(getData())