from geopy.distance import geodesic

def nearest_vehicle(emergency_location, vehicles):

    nearest = None
    min_distance = float("inf")

    for v in vehicles:

        dist = geodesic(
            emergency_location,
            v["location"]
        ).km

        if dist < min_distance:
            min_distance = dist
            nearest = v

    return nearest