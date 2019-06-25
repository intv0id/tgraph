#-----------------------------------------------------------
#
#   This script is originally from 
# https://gist.githubusercontent.com/patrickfuller/8143294/raw/12701eb098c4d0c37cc0977de9df6f324d24e48f/github_traversal.py
#
#-----------------------------------------------------------

import requests
import getpass
import sys
import json
from queue import Queue

# This is a script, let's be lazy. We'll fill up this global and print it.
g = {"nodes": [], "edges": []}
# And here's the cutoff criterion
MAX_NODES = 50

# Log in to avoid rate limiting
auth = input("Username: "), getpass.getpass()
r = requests.get("https://api.github.com", auth=auth)
if r.status_code != 200:
    sys.stderr.write("Could not authenticate with Github. Exiting.\n")
    sys.exit()
sys.stderr.write("Connected and authenticated.\n")

# BFS
queue = Queue()
queue.put((auth[0], None))
while queue:
    if len(g["nodes"]) > MAX_NODES:
        break
    user, parent = queue.get()
    if user in g["nodes"]:
        continue
    sys.stderr.write(f"Traversing {user}.\n")
    json_result = requests.get(f"https://api.github.com/users/{user}", auth=auth).json()
    g["nodes"].append({"size": pow(json_result["followers"], 1/3), "name": user, "url": f"https://github.com/{user}"})
    if parent:
        g["edges"].append({"src": parent, "dst": user})
    followed = [res["login"] for res in requests.get(f"https://api.github.com/users/{user}/following", auth=auth).json()]
    for f in followed:
        queue.put((f, user))


with open("github.json", "w") as out_file:
    out_file.write(json.dumps(g))