import parsingCSV as pcsv
import numpy as np
from scipy.sparse.linalg import eigs
from scipy.linalg import eig
from haversine import haversine



def distance(v1, v2):
    return haversine((v1[0], v1[1]), (v2[0], v2[1]))

def make_G(lat_long):
    G = np.zeros([len(lat_long), len(lat_long)])

    for i in range(len(G)):
        for j in range(i+1, len(G)):
            dist = distance(lat_long[i], lat_long[j])
            G[i][j] = dist
            G[j][i] = dist

    return G

def make_G_prime(students, G):
    id_dict = {}
    class_dict = {}

    count = 0
    for student in students:
        id_dict[student[0]] = count
        class_dict[count] = student[3]
        count = count + 1

    for student in students:
        print(student[2])
        G[id_dict[student[0]]][id_dict[student[1]]] = G[id_dict[student[0]]][id_dict[student[1]]] * 0.75
        G[id_dict[student[1]]][id_dict[student[0]]] = G[id_dict[student[0]]][id_dict[student[1]]] * 0.75
        G[id_dict[student[0]]][id_dict[student[2]]] = G[id_dict[student[0]]][id_dict[student[2]]] * 0.75
        G[id_dict[student[2]]][id_dict[student[0]]] = G[id_dict[student[0]]][id_dict[student[2]]] * 0.75

    for i in range(len(G)):
        for j in range(i + 1, len(G)):
            if class_dict[i] == class_dict[j]:
                G[i][j] = G[i][j] * 0.75
                G[j][i] = G[i][j] * 0.75

    return G

# def make_W(G, alpha=1):
#     W = np.exp(-np.power(G, 2) / alpha)
#
#     return W
#
# def make_D(W):
#     D = np.zeros([len(W), len(W)])
#     for i in range(len(W)):
#         sum_d = 0
#         for j in range(len(W)):
#             if i != j:
#                 sum_d = sum_d + W[i][j]
#         D[i][i] = sum_d
#
#     return D
#
# def make_L(D, W):
#     return D - W
#
# def make_clusters(L, vpc=4):
#     print(L)
#
#     eig_count = int(np.log2(len(L) / vpc))
#     if eig_count == 0: eig_count = 1
#
#     # [e_vals, e_vects] = eigs(L, k=eig_count)
#     s = eig(L, left=True)
#     # print(len(s))
#     e_vals = s[0][:eig_count]
#     e_vects = s[1]
#     # print(s)
#     #
#     #
#     # print(e_vals)
#     # print(e_vects)
#
#     clusters = np.empty(1)
#     for point in e_vects.real:
#         cluster = 0
#         for val in range(eig_count):
#             if point[val] > 0.0: cluster = cluster + np.power(2, val)
#         clusters = np.append(clusters, cluster)
#
#     return clusters[1:]
#
# lat_long = np.array([[1,1],
#                      [1,2],
#                      [1,3],
#                      [1,1],
#                      [2,1],
#                      [3,1]])
#
# students = np.array([[1, 2, 3, 1],
#                      [2, 2, 3, 1],
#                      [3, 2, 4, 1],
#                      [4, 2, 3, 2],
#                      [5, 2, 3, 2],
#                      [6, 2, 4, 2]])

# G = make_G(lat_long)
# G_prime = make_G_prime(students, G)
# print(G_prime)
# W = make_W(G_prime)
# D = make_D(W)
# L = make_L(D, W)
# print(make_clusters(L))