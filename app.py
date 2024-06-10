from flask import Flask, jsonify, request
import pandas as pd
from sklearn.cluster import KMeans
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://triprecommender.onrender.com"}})

def convert_to_float(value):
    try:
        return float(value)
    except ValueError:
        return None

# Load data from CSV
print("Loading data from CSV...")
df = pd.read_csv("Places.csv")
print("Sort by ranking position...")
top = df.sort_values(by=['Rating'], ascending=True)

# Load restaurant data
df_res = pd.read_csv("Restaurants.csv")
top_res = df_res.dropna(subset=['rankingPosition', 'image', 'longitude', 'latitude'])

# Load shopping malls data
df_malls = pd.read_csv("ShoppingMalls.csv")
top_malls = df_malls.dropna(subset=['Ranking', 'image', 'longitude', 'latitude', 'phone', 'website'])

# Load hotels data
df_hotels = pd.read_csv("Hotels.csv")
top_hotels = df_hotels.dropna(subset=['image', 'longitude', 'latitude'])

# Extract coordinates for KMeans
coords_places = top[['longitude', 'latitude']]
coords_res = top_res[['longitude', 'latitude']]
coords_malls = top_malls[['longitude', 'latitude']]
coords_hotels = top_hotels[['longitude', 'latitude']]

# Fit KMeans with k=3 for all datasets
kmeans_places = KMeans(n_clusters=3, init='k-means++')
kmeans_places.fit(coords_places)
top['cluster'] = kmeans_places.labels_

kmeans_res = KMeans(n_clusters=8, init='k-means++')
kmeans_res.fit(coords_res)
top_res['cluster'] = kmeans_res.labels_

kmeans_malls = KMeans(n_clusters=3, init='k-means++')
kmeans_malls.fit(coords_ma
