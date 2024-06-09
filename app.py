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
coords_res = top_res[['longitude', 'latitude']]
coords_malls = top_malls[['longitude', 'latitude']]
coords_hotels = top_hotels[['longitude', 'latitude']]

# Fit KMeans with k=3 for all datasets
kmeans_res = KMeans(n_clusters=8, init='k-means++')
kmeans_res.fit(coords_res)
top_res['cluster'] = kmeans_res.labels_

kmeans_malls = KMeans(n_clusters=3, init='k-means++')
kmeans_malls.fit(coords_malls)
top_malls['cluster'] = kmeans_malls.labels_

kmeans_hotels = KMeans(n_clusters=3, init='k-means++')
kmeans_hotels.fit(coords_hotels)
top_hotels['cluster'] = kmeans_hotels.labels_

def recommend_places(data, kmeans, longitude, latitude, top_n=5):
    cluster = kmeans.predict(np.array([longitude, latitude]).reshape(1, -1))[0]
    cluster_df = data[data['cluster'] == cluster].iloc[:top_n]
    return cluster_df

@app.route('/places')
def get_clusters():
    clusters_data = top[['Name', 'Rating', 'address', 'image', 'longitude', 'latitude']]
    clusters_list = clusters_data.to_dict(orient='records')
    return jsonify({'clusters': clusters_list})

@app.route('/places/get_top_res')
def get_top_res():
    top_res_data = top_res[['name', 'address', 'image', 'phone']].to_dict(orient='records')
    return jsonify({'top_res': top_res_data})

@app.route('/places/get_top_malls')
def get_top_malls():
    top_malls_data = top_malls[['name', 'address', 'image', 'phone']].to_dict(orient='records')
    return jsonify({'top_malls': top_malls_data})

@app.route('/places/get_top_hotels')
def get_top_hotels():
    top_hotels_data = top_hotels[['name', 'image', 'phone']].to_dict(orient='records')
    return jsonify({'top_hotels': top_hotels_data})

@app.route('/places/recommend')
def recommend():
    longitude_str = request.args.get('longitude')
    latitude_str = request.args.get('latitude')
    category = request.args.get('category', 'restaurants')

    longitude = convert_to_float(longitude_str)
    latitude = convert_to_float(latitude_str)

    if longitude is not None and latitude is not None:
        if category == 'malls':
            recommended_malls = recommend_places(top_malls, kmeans_malls, longitude, latitude)
            return jsonify({'recommended_malls': recommended_malls.to_dict(orient='records')})
        elif category == 'hotels':
            recommended_hotels = recommend_places(top_hotels, kmeans_hotels, longitude, latitude)
            return jsonify({'recommended_hotels': recommended_hotels.to_dict(orient='records')})
        else:
            recommended_restaurants = recommend_places(top_res, kmeans_res, longitude, latitude)
            return jsonify({'recommended_restaurants': recommended_restaurants.to_dict(orient='records')})
    else:
        return jsonify({'error': 'Invalid longitude or latitude value.'}), 400

@app.route('/restaurants/recommend')
def recommend_nearby():
    longitude_str = request.args.get('longitude')
    latitude_str = request.args.get('latitude')

    longitude = convert_to_float(longitude_str)
    latitude = convert_to_float(latitude_str)

    if longitude is not None and latitude is not None:
        recommended_malls = recommend_places(top_malls, kmeans_malls, longitude, latitude)
        recommended_hotels = recommend_places(top_hotels, kmeans_hotels, longitude, latitude)
        recommended_places = recommend_places(top, kmeans_res, longitude, latitude)
        
        return jsonify({
            'recommended_malls': recommended_malls.to_dict(orient='records'),
            'recommended_hotels': recommended_hotels.to_dict(orient='records'),
            'recommended_places': recommended_places.to_dict(orient='records')
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
