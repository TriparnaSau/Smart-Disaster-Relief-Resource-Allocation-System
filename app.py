from flask import Flask, render_template, request, jsonify
from utils.helpers import load_json
from algorithms.dispatch import nearest_vehicle

app = Flask(__name__)

hospitals = load_json("data/hospitals.json")["hospitals"]
firestations = load_json("data/firestations.json")["firestations"]
police = load_json("data/police.json")["police"]
ambulances = load_json("data/ambulances.json")["ambulances"]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/services")
def services():

    return jsonify({
        "hospitals": hospitals,
        "firestations": firestations,
        "police": police
    })


@app.route("/ambulances")
def get_ambulances():
    return jsonify(ambulances)


@app.route("/emergency", methods=["POST"])
def emergency():

    data = request.json

    lat = data["lat"]
    lon = data["lon"]

    emergency_location = (lat, lon)

    nearest = nearest_vehicle(emergency_location, ambulances)

    return jsonify({
        "ambulance": nearest,
        "location": emergency_location
    })


if __name__ == "__main__":
    app.run(debug=True)