import React, { useState } from 'react';
import config from './config';

function RecommendComponent() {
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);

  const handleRecommendation = () => {
    if (longitude && latitude) {
      const url = `${config.backendUrl}/recommend?longitude=${longitude}&latitude=${latitude}`;
      console.log("Fetching URL:", url);  // Debugging line to ensure URL is correct
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log("Data received:", data); // Log the received data
          setRecommendedRestaurants(data.recommended_restaurants);
        })
        .catch(error => {
          console.error('Error fetching recommendation:', error);
        });
    } else {
      alert("Please enter both latitude and longitude.");
    }
  };

  return (
    <div>
      <h2>Recommendation</h2>
      <div>
        <label htmlFor="longitude">Longitude:</label>
        <input
          type="text"
          id="longitude"
          value={longitude}
          onChange={e => setLongitude(e.target.value)}
          placeholder="Enter longitude"
          required
        />
      </div>
      <div>
        <label htmlFor="latitude">Latitude:</label>
        <input
          type="text"
          id="latitude"
          value={latitude}
          onChange={e => setLatitude(e.target.value)}
          placeholder="Enter latitude"
          required
        />
      </div>
      <button onClick={handleRecommendation}>Get Recommendation</button>
      <div>
        <h3>Recommended Restaurants:</h3>
        {recommendedRestaurants.length > 0 ? (
          <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
            <tbody>
              {recommendedRestaurants.map((restaurant, index) => (
                index % 2 === 0 && (
                  <tr key={index} style={{ border: "1px solid black" }}>
                    <td style={{ border: "1px solid black", padding: "10px" }}>
                      <h4>{restaurant.name}</h4>
                      <p>Ranking Position: {restaurant.rankingPosition}</p>
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        style={{ width: "200px", height: "150px", objectFit: "cover" }}
                      />
                    </td>
                    {recommendedRestaurants[index + 1] && (
                      <td style={{ border: "1px solid black", padding: "10px" }}>
                        <h4>{recommendedRestaurants[index + 1].name}</h4>
                        <p>Ranking Position: {recommendedRestaurants[index + 1].rankingPosition}</p>
                        <img
                          src={recommendedRestaurants[index + 1].image}
                          alt={recommendedRestaurants[index + 1].name}
                          style={{ width: "200px", height: "150px", objectFit: "cover" }}
                        />
                      </td>
                    )}
                  </tr>
                )
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recommendations available. Please enter coordinates and click "Get Recommendation".</p>
        )}
      </div>
    </div>
  );
}

export default RecommendComponent;
