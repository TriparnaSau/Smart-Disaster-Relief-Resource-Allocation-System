import osmnx as ox

def load_graph():

    place = "Purba Medinipur, West Bengal, India"

    graph = ox.graph_from_place(place, network_type="drive")

    return graph