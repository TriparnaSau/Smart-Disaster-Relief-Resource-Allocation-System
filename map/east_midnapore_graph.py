import osmnx as ox


def load_graph():

    place = "Purba Medinipur, West Bengal, India"

    graph = ox.graph_from_place(
        place,
        network_type="drive"
    )

    graph = ox.add_edge_speeds(graph)

    graph = ox.add_edge_travel_times(graph)

    return graph