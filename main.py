from flask import Flask, jsonify
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()


IQAIR_API_KEY = os.getenv("IQAIR_API_KEY")

@app.route('/')
def index():
    print(IQAIR_API_KEY)
    return 'index'


# print("don't go outside")