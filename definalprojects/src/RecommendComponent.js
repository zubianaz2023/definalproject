import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import config from './config'; // Ensure this imports the correct config file


function RecommendComponent() {
  const query = new URLSearchParams(useLocation().search);
  const longitude = query.get('longitude');
  const latitude = query.get('latitude');
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [recommendedMalls, setRecommendedMalls] = useState([]);
  const [recommendedHotels, setRecommendedHotels] = useState([]);
  const [topResData, setTopResData] = useState([]);
  const [topMallsData, setTopMallsData] = useState([]);
  const [topHotelsData, setTopHotelsData] = useState([]);

  useEffect(() => {
    // Fetch top_res data
    fetch(`${config.backendUrl}/places/get_top_res`)
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
    fetch(`${config.backendUrl}/places/get_top_malls`)
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
    // Fetch top_hotels data
    fetch(`${config.backendUrl}/places/get_top_hotels`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.top_hotels) {
          setTopHotelsData(data.top_hotels);
          
        } else {
          console.error('Error fetching top_hotels data:', data.error);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (longitude && latitude) {
      // Fetch recommended restaurants
      fetch(`${config.backendUrl}/places/recommend?longitude=${longitude}&latitude=${latitude}&category=restaurants`)
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
      fetch(`${config.backendUrl}/places/recommend?longitude=${longitude}&latitude=${latitude}&category=malls`)
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

      // Fetch recommended hotels
      fetch(`${config.backendUrl}/places/recommend?longitude=${longitude}&latitude=${latitude}&category=hotels`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.recommended_hotels) {
            setRecommendedHotels(data.recommended_hotels);
          } else {
            console.error('Error fetching recommended hotels:', data.error);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [longitude, latitude]);

  return (
    <div>
     

<h3>Recommended Restaurants</h3>
{recommendedRestaurants.length > 0 ? (
  <table className="recommend-table">
    <thead>
      <tr>
        {recommendedRestaurants.slice(0, 5).map((restaurant, index) => (
          <th key={index}>Restaurant {index + 1}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        {recommendedRestaurants.slice(0, 5).map((restaurant, index) => (
          <td key={index}>
            <div className="recommend-item">
              <div>
                <strong>Name:</strong> {restaurant.name}
              </div>
              <div>
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  style={{
                    width: "200px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div>
                <strong>Address:</strong> {restaurant.address}
              </div>
            </div>
          </td>
        ))}
      </tr>
    </tbody>
  </table>
) : (
  <p>No Restaurants found.</p>
)}

<h3>Recommended Hotels</h3>
{recommendedHotels.length > 0 ? (
  <table className="recommend-table">
    <thead>
      <tr>
        {recommendedHotels.slice(0, 5).map((hotel, index) => (
          <th key={index}>Hotel {index + 1}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        {recommendedHotels.slice(0, 5).map((hotel, index) => (
          <td key={index}>
            <div className="recommend-item">
              <div>
                <strong>Name:</strong> {hotel.name}
              </div>
              <div>
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  style={{
                    width: "200px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div>
                <strong>Phone:</strong> {hotel.phone}
              </div>
            </div>
          </td>
        ))}
      </tr>
    </tbody>
  </table>
) : (
  <p>No recommended Hotels found.</p>
)}
<h3>Recommended Shopping Malls</h3>
{recommendedMalls.length > 0 ? (
  <table className="recommend-table">
    <thead>
      <tr>
        {recommendedMalls.slice(0, 5).map((mall, index) => (
          <th key={index}>Mall {index + 1}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        {recommendedMalls.slice(0, 5).map((mall, index) => (
          <td key={index}>
            <div className="recommend-item">
              <div>
                <strong>Name:</strong> {mall.name}
              </div>
              <div>
                <img
                  src={mall.image}
                  alt={mall.name}
                  style={{
                    width: "200px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </td>
        ))}
      </tr>
    </tbody>
  </table>
) : (
  <p>No recommended shopping malls found.</p>
)}

      
    
    </div>
  );
}

export default RecommendComponent;
