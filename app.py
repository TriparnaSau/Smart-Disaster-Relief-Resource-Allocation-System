import osmnx as ox
import networkx as nx

from flask import Flask, render_template, request, jsonify

from map.east_midnapore_graph import load_graph
from utils.helpers import load_json
from algorithms.dispatch import nearest_vehicle

app = Flask(__name__)

# ---------------- LOAD ROAD GRAPH ----------------

graph = load_graph()


# ---------------- ROAD ROUTE FUNCTION ----------------

def get_road_route(start_location, end_location):

    try:

        # Find nearest graph nodes

        start_node = ox.distance.nearest_nodes(
            graph,
            start_location[1],
            start_location[0]
        )

        end_node = ox.distance.nearest_nodes(
            graph,
            end_location[1],
            end_location[0]
        )

        # Find shortest path

        route = nx.shortest_path(
            graph,
            start_node,
            end_node,
            weight="length"
        )

        route_coordinates = []

        # Convert graph nodes to coordinates

        for node in route:

            lat = graph.nodes[node]["y"]
            lon = graph.nodes[node]["x"]

            route_coordinates.append([lat, lon])

        return route_coordinates

    except Exception as e:

        print("ROUTE ERROR:", e)

        # Fallback straight line route

        return [
            [start_location[0], start_location[1]],
            [end_location[0], end_location[1]]
        ]


# ---------------- LOAD JSON DATA ----------------

hospitals = load_json(
    "data/hospitals.json"
)["hospitals"]

firestations = load_json(
    "data/firestations.json"
)["firestations"]

police = load_json(
    "data/police.json"
)["police"]

ambulances = load_json(
    "data/ambulances.json"
)["ambulances"]

relief_camps = load_json(
    "data/relief_camps.json"
)["relief_camps"]

disasters = load_json(
    "data/disasters.json"
)["disasters"]


# ---------------- HOME PAGE ----------------

@app.route("/")
def home():

    return render_template("index.html")


# ---------------- SERVICES API ----------------

@app.route("/services")
def services():

    return jsonify({

        "hospitals": hospitals,

        "firestations": firestations,

        "police": police,

        "ambulances": ambulances,

        "relief_camps": relief_camps

    })


# ---------------- EMERGENCY RESPONSE ----------------

@app.route("/emergency", methods=["POST"])
def emergency():

    data = request.json

    user_location = (
        data["latitude"],
        data["longitude"]
    )

    disaster = data["disaster"]

    severity = data["severity"]

    response = {}

    # ---------------- FLOOD ----------------

    if disaster == "Flood":

        ambulance = nearest_vehicle(
            user_location,
            ambulances
        )

        response["ambulance"] = ambulance

        response["ambulance_route"] = get_road_route(
            ambulance["location"],
            user_location
        )

        hospital = nearest_vehicle(
            user_location,
            hospitals
        )

        response["hospital"] = hospital

        response["hospital_route"] = get_road_route(
            hospital["location"],
            user_location
        )

        relief_camp = nearest_vehicle(
            user_location,
            relief_camps
        )

        response["relief_camp"] = relief_camp

        response["relief_camp_route"] = get_road_route(
            relief_camp["location"],
            user_location
        )

    # ---------------- CYCLONE ----------------

    elif disaster == "Cyclone":

        ambulance = nearest_vehicle(
            user_location,
            ambulances
        )

        response["ambulance"] = ambulance

        response["ambulance_route"] = get_road_route(
            ambulance["location"],
            user_location
        )

        hospital = nearest_vehicle(
            user_location,
            hospitals
        )

        response["hospital"] = hospital

        response["hospital_route"] = get_road_route(
            hospital["location"],
            user_location
        )

        police_station = nearest_vehicle(
            user_location,
            police
        )

        response["police"] = police_station

        response["police_route"] = get_road_route(
            police_station["location"],
            user_location
        )

        relief_camp = nearest_vehicle(
            user_location,
            relief_camps
        )

        response["relief_camp"] = relief_camp

        response["relief_camp_route"] = get_road_route(
            relief_camp["location"],
            user_location
        )

    # ---------------- FIRE ----------------

    elif disaster == "Fire":

        firestation = nearest_vehicle(
            user_location,
            firestations
        )

        response["firestation"] = firestation

        response["firestation_route"] = get_road_route(
            firestation["location"],
            user_location
        )

        ambulance = nearest_vehicle(
            user_location,
            ambulances
        )

        response["ambulance"] = ambulance

        response["ambulance_route"] = get_road_route(
            ambulance["location"],
            user_location
        )

    # ---------------- ROAD ACCIDENT ----------------

    elif disaster == "Road Accident":

        ambulance = nearest_vehicle(
            user_location,
            ambulances
        )

        response["ambulance"] = ambulance

        response["ambulance_route"] = get_road_route(
            ambulance["location"],
            user_location
        )

        hospital = nearest_vehicle(
            user_location,
            hospitals
        )

        response["hospital"] = hospital

        response["hospital_route"] = get_road_route(
            hospital["location"],
            user_location
        )

        police_station = nearest_vehicle(
            user_location,
            police
        )

        response["police"] = police_station

        response["police_route"] = get_road_route(
            police_station["location"],
            user_location
        )

    else:

        return jsonify({
            "error": "Invalid disaster type"
        })

    # Add severity to response

    response["severity"] = severity

    return jsonify(response)


# ---------------- DISASTER RELIEF ----------------

@app.route("/disaster", methods=["POST"])
def disaster():

    data = request.json

    location = (
        data["latitude"],
        data["longitude"]
    )

    nearest_camp = nearest_vehicle(
        location,
        relief_camps
    )

    return jsonify({

        "relief_camp": nearest_camp

    })


# ---------------- RUN APP ----------------

if __name__ == "__main__":

    app.run(debug=True)