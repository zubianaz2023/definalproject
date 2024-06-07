import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import config from './config'; // Ensure this imports the correct config file
 

function RecommendComponent() {
  const query = new URLSearchParams(useLocation().search);
  const longitude = query.get('longitude');
  const latitude = query.get('latitude');
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [recommendedMalls, setRecommendedMalls] = useState([]);
  const [topResData, setTopResData] = useState([]);
  const [topMallsData, setTopMallsData] = useState([]);

  useEffect(() => {
    // Fetch top_res data
    fetch(`${config.backendUrl}/get_top_res`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.top_res) {
          setTopResData(data.top_res);
        } else {
          console.error('Error fetching top_res data:', data.error);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch top_malls data
    fetch(`${config.backendUrl}/get_top_malls`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.top_malls) {
          setTopMallsData(data.top_malls);
        } else {
          console.error('Error fetching top_malls data:', data.error);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (longitude && latitude) {
      // Fetch recommended restaurants
      fetch(`${config.backendUrl}/recommend?longitude=${longitude}&latitude=${latitude}&category=restaurants`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
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

      // Fetch recommended malls
      fetch(`${config.backendUrl}/recommend?longitude=${longitude}&latitude=${latitude}&category=malls`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.recommended_malls) {
            setRecommendedMalls(data.recommended_malls);
          } else {
            console.error('Error fetching recommended malls:', data.error);
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
        <table className="recommend-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Ranking Position</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {recommendedRestaurants.map((restaurant, index) => (
              <tr key={index}>
                <td>{restaurant.name}</td>
                <td><img src={restaurant.image} alt={restaurant.name} className="restaurant-image" /></td>
                <td>{restaurant.rankingPosition}</td>
                <td>{restaurant.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No recommended restaurants found.</p>
      )}

      <h3>Recommended Shopping Malls</h3>
      {recommendedMalls.length > 0 ? (
        <table className="recommend-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Ranking Position</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {recommendedMalls.map((mall, index) => (
              <tr key={index}>
                <td>{mall.name}</td>
                <td><img src={mall.image} alt={mall.name} className="mall-image" /></td>
                <td>{mall.rankingPosition}</td>
                <td>{mall.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No recommended shopping malls found.</p>
      )}
    </div>
  );
}

export default RecommendComponent;
