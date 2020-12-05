from flask import Flask, jsonify
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()


IQAIR_API_KEY = os.getenv("IQAIR_API_KEY")
DIRECTIONS_API_KEY = os.getenv("DIRECTIONS_API_KEY")
MAPS_API_KEY = os.getenv("MAPS_API_KEY")

@app.route('/')
def index():
    return 'index'


# print("don't go outside")