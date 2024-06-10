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
df_res = pd.read_csv("Restaurant.csv")
top_res = df_res.dropna(subset=['Ranking', 'image', 'longitude', 'latitude', 'phone'])

# Load shopping malls data
df_malls = pd.read_csv("ShoppingMalls.csv")
top_malls = df_malls.dropna(subset=['Ranking', 'image', 'longitude', 'latitude', 'phone', 'website'])

# Load hotels data
df_hotels = pd.read_csv("Hotels.csv")
top_hotels = df_hotels.dropna(subset=['image', 'longitude', 'latitude'])

# Extract coordinates for KMeans
coords_res = top_res[['longitude', 'latitude']]
coords_malls = top_malls[['longitude', 'latitude']]
coords_hotels = top_hotels[['longitude', 'latitude']]
coords_places = top[['longitude', 'latitude']]

# Fit KMeans with k=3 for all datasets
kmeans_res = KMeans(n_clusters=8, init='k-means++')
kmeans_res.fit(coords_res)
top_res['cluster'] = kmeans_res.labels_

kmeans_malls = KMeans(n_clusters=3, init='k-means++')
kmeans_malls.fit(coords_malls)
top_malls['cluster'] = kmeans_malls.labels_

kmeans_hotels = KMeans(n_clusters=8, init='k-means++')
kmeans_hotels.fit(coords_hotels)
top_hotels['cluster'] = kmeans_hotels.labels_

kmeans_places = KMeans(n_clusters=8, init='k-means++')
kmeans_places.fit(coords_places)
top['cluster'] = kmeans_places.labels_


def recommend_places(longitude, latitude):
    cluster = kmeans_places.predict(np.array([longitude, latitude]).reshape(1, -1))[0]
    cluster_df = top[top['cluster'] == cluster].iloc[:3, [0, 3, 6, 7, 8]]
    return cluster_df

def recommend_restaurants(longitude, latitude):
    cluster = kmeans_res.predict(np.array([longitude, latitude]).reshape(1, -1))[0]
    cluster_df = top_res[top_res['cluster'] == cluster].iloc[:3, [0, 2, 3, 4, 5, 7, 8]]
    return cluster_df

def recommend_malls(longitude, latitude):
    cluster = kmeans_malls.predict(np.array([longitude, latitude]).reshape(1, -1))[0]
    cluster_df = top_malls[top_malls['cluster'] == cluster].iloc[:3, [0, 1, 2, 3, 4]]
    return cluster_df

def recommend_hotels(longitude, latitude):
    cluster = kmeans_hotels.predict(np.array([longitude, latitude]).reshape(1, -1))[0]
    cluster_df = top_hotels[top_hotels['cluster'] == cluster].iloc[:3, [0, 1, 2, 6, 7]]
    return cluster_df
    
@app.route('/places')
def get_clusters():
    clusters_data = top[['Name', 'Rating', 'image', 'longitude', 'latitude','Location']]
    clusters_list = clusters_data.to_dict(orient='records')
    return jsonify({'clusters': clusters_list})

@app.route('/restaurants')
def get_restaurant_clusters():
    clusters_data = top_res[['name', 'Ranking', 'address', 'image', 'longitude', 'latitude', 'phone']]
    clusters_list = clusters_data.to_dict(orient='records')
    return jsonify({'clusters': clusters_list})
@app.route('/places/recommend')
def recommend_places_endpoint():
    longitude_str = request.args.get('longitude')
    latitude_str = request.args.get('latitude')

    longitude = convert_to_float(longitude_str)
    latitude = convert_to_float(latitude_str)

    if longitude is not None and latitude is not None:
        recommended_restaurants = recommend_restaurants(longitude, latitude)
        recommended_malls = recommend_malls(longitude, latitude)
        recommended_hotels = recommend_hotels(longitude, latitude)
        
        return jsonify({
            'recommended_restaurants': recommended_restaurants.to_dict(orient='records'),
            'recommended_malls': recommended_malls.to_dict(orient='records'),
            'recommended_hotels': recommended_hotels.to_dict(orient='records')
        })
    else:
        return jsonify({'error': 'Invalid longitude or latitude value.'}), 400

@app.route('/restaurants/recommend')
def recommend_restaurants_endpoint():
    longitude_str = request.args.get('longitude')
    latitude_str = request.args.get('latitude')

    longitude = convert_to_float(longitude_str)
    latitude = convert_to_float(latitude_str)

    if longitude is not None and latitude is not None:
        recommended_places = recommend_places(longitude, latitude)
        recommended_malls = recommend_malls(longitude, latitude)
        recommended_hotels = recommend_hotels(longitude, latitude)
        
        return jsonify({
            'recommended_places': recommended_places.to_dict(orient='records'),
            'recommended_malls': recommended_malls.to_dict(orient='records'),
            'recommended_hotels': recommended_hotels.to_dict(orient='records')
        })
    else:
        return jsonify({'error': 'Invalid longitude or latitude value.'}), 400

@app.errorhandler(404)
def page_not_found(e):
    return jsonify({'error': 'Not Found'}), 404

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
