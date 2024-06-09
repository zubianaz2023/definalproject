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
    // Fetch top_hotels data
    fetch(`${config.backendUrl}/get_top_hotels`)
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

      // Fetch recommended hotels
      fetch(`${config.backendUrl}/recommend?longitude=${longitude}&latitude=${latitude}&category=hotels`)
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
                <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            style={{
                              width: "200px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
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
                
                
                <td>{mall.address}</td>
              <img
                            src={mall.image}
                            alt={mall.name}
                            style={{
                              width: "200px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No recommended shopping malls found.</p>
      )}

      <h3>Recommended Hotels</h3>
      {recommendedHotels.length > 0 ? (
        <table className="recommend-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {recommendedHotels.map((hotel, index) => (
              <tr key={index}>
                <td>{hotel.name}</td>
                
               <img
                            src={hotel.image}
                            alt={hotel.name}
                            style={{
                              width: "200px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                <td>{hotel.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No recommended hotels found.</p>
      )}
    </div>
  );
}

export default RecommendComponent;
