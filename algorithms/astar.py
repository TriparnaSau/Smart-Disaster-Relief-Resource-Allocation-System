import networkx as nx

def astar_path(graph, start, end):

    path = nx.astar_path(
        graph,
        start,
        end,
        weight="length"
    )

    distance = nx.astar_path_length(
        graph,
        start,
        end,
        weight="length"
    )

    return path, distance