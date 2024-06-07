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
# Load data from CSV
df_res = pd.read_csv("Restaurants.csv")
filtered_df = df_res.dropna(subset=['rankingPosition', 'image','longitude','latitude'])
top_res = filtered_df.sort_values(by=['rankingPosition'], ascending=True)

# Extract coordinates
coords = top_res[['longitude', 'latitude']]

# Fit KMeans with k=3
kmeans = KMeans(n_clusters=3, init='k-means++')
kmeans.fit(coords)
top_res['cluster'] = kmeans.labels_

def recommend_restaurants(top_res, longitude, latitude):
    cluster = kmeans.predict(np.array([longitude, latitude]).reshape(1, -1))[0]
    cluster_df = top_res[top_res['cluster'] == cluster].iloc[:5, [0,1,4,8]]
    return cluster_df

@app.route('/')
def get_clusters():
    clusters_data = top[['Name', 'Rating', 'address', 'image', 'longitude', 'latitude']]
    clusters_list = clusters_data.to_dict(orient='records')
    return jsonify({'clusters': clusters_list})

@app.route('/get_top_res')
def get_top_res():
    top_res_datas=top_res[['name','address', 'image', 'phone']]
    top_res_data = top_res_datas.to_dict(orient='records')
    return jsonify({'top_res': top_res_data})

@app.route('/recommend')
def recommend():
    longitude_str = request.args.get('longitude')
    latitude_str = request.args.get('latitude')

    longitude = convert_to_float(longitude_str)
    latitude = convert_to_float(latitude_str)

    if longitude is not None and latitude is not None:
        recommended_restaurants = recommend_restaurants(top_res, longitude, latitude)
        return jsonify({'recommended_restaurants': recommended_restaurants.to_dict(orient='records')})
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
