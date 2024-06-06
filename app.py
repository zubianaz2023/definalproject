from flask import Flask, jsonify, request
import pandas as pd
from sklearn.cluster import KMeans
import numpy as np
from flask_cors import CORS


# Initialize W&B with your API key


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
print("Loading data from CSV...")
df_res = pd.read_csv("dataset.csv")
filtered_df = df_res.dropna(subset=['longitude', 'latitude','rankingPosition','image'])
print("Sort by ranking position...")
top_res = filtered_df.sort_values(by=['rankingPosition'], ascending=True)
#Extract coordinates
print("Extracting coordinates...")
coords = top_res[['longitude', 'latitude']]
# Fit KMeans with k=3
print("Fitting KMeans model...")
kmeans = KMeans(n_clusters=3, init='k-means++')
kmeans.fit(coords)

top_res['cluster'] = kmeans.labels_
print(top_res)


def recommend_restaurants(top_res, longitude, latitude):
    cluster = kmeans.predict(np.array([longitude, latitude]).reshape(1, -1))[0]
    print("Cluster:", cluster)
    cluster_df = top_[top_res['cluster'] == cluster].iloc[:5, [0,3,6,7,8]]
    return cluster_df


@app.route('/')
def get_clusters():
    # Add other information to the clusters data
    print("Preparing clusters data...")
    clusters_data = top[['name', 'Rating', 'address', 'image','longitude','latitude']]

    # Convert clusters data to list of dictionaries
    print("Converting clusters data to list of dictionaries...")
    clusters_list = clusters_data.to_dict(orient='records')

    print("Data processing completed.")
    return jsonify({'clusters': clusters_list})

@app.route('/recommend')
def recommend():
    
    
    print(top)

    # Convert longitude and latitude strings to floats
    longitude = convert_to_float(longitude_str)
    latitude = convert_to_float(latitude_str)

    if longitude is not None and latitude is not None:
        recommended_restaurants = recommend_restaurants(top_res, longitude, latitude)
        return jsonify({'recommended_restaurants': recommended_restaurants.to_dict(orient='records')
})
    else:
        return jsonify({'error': 'Invalid longitude or latitude value.'})
if __name__ == '__main__':
    app.run(debug=True)
