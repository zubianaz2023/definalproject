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
df_res = pd.read_csv("dataset.csv")
filtered_df = df_res.dropna(subset=['longitude', 'latitude', 'rankingPosition', 'image'])
top_res = filtered_df.sort_values(by=['rankingPosition'], ascending=True)

# Extract coordinates
coords = top_res[['longitude', 'latitude']]
kmeans = KMeans(n_clusters=3, init='k-means++')
kmeans.fit(coords)

top_res['cluster'] = kmeans.labels_

def recommend_restaurants(top_res, longitude, latitude):
    cluster = kmeans.predict(np.array([longitude, latitude]).reshape(1, -1))[0]
    cluster_df = top_res[top_res['cluster'] == cluster].iloc[:5, ['name', 'address', 'image', 'rankingPosition']]
    return cluster_df

@app.route('/')
def get_clusters():
    clusters_data = top_res[['name', 'rankingPosition', 'address', 'image', 'longitude', 'latitude']]
    clusters_list = clusters_data.to_dict(orient='records')
    return jsonify({'clusters': clusters_list})

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
        return jsonify({'error': 'Invalid longitude or latitude value.'})

@app.route('/get_top_res')
def get_top_res():
    top_res_data = top_res.to_dict(orient='records')
    return jsonify({'top_res': top_res_data})

if __name__ == '__main__':
    app.run(debug=True)
