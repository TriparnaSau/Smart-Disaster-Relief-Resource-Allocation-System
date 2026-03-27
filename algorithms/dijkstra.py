import networkx as nx

def shortest_path(graph, start, end):

    path = nx.shortest_path(
        graph,
        source=start,
        target=end,
        weight="length"
    )

    distance = nx.shortest_path_length(
        graph,
        source=start,
        target=end,
        weight="length"
    )

    return path, distance