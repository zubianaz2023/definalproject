import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function RecommendComponent() {
  const query = new URLSearchParams(useLocation().search);
  const longitude = query.get('longitude');
  const latitude = query.get('latitude');
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);

  useEffect(() => {
    if (longitude && latitude) {
      fetch(`http://localhost:5000/recommend?longitude=${longitude}&latitude=${latitude}`)
        .then(response => response.json())
        .then(data => {
          if (data.recommended_restaurants) {
            setRecommendedRestaurants(data.recommended_restaurants);
          } else {
            console.error('Error fetching recommended restaurants:', data.error);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [longitude, latitude]);

  return (
    <div>
      <h2>Recommend Component</h2>
      <p>Longitude: {longitude}</p>
      <p>Latitude: {latitude}</p>
      <h3>Recommended Restaurants</h3>
      {recommendedRestaurants.length > 0 ? (
        <ul>
          {recommendedRestaurants.map((restaurant, index) => (
            <li key={index}>
              <h4>{restaurant.name}</h4>
              <img src={restaurant.image} alt={restaurant.name} style={{ width: '200px', height: '150px', objectFit: 'cover' }} />
              <p>Ranking Position: {restaurant.rankingPosition}</p>
              <p>Address: {restaurant.address}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommended restaurants found.</p>
      )}
    </div>
  );
}

export default RecommendComponent;
