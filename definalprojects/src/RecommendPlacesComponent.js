import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import config from './config'; // Ensure this imports the correct config file

function RecommendPlacesComponent() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const longitude = query.get('longitude');
  const latitude = query.get('latitude');
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [recommendedMalls, setRecommendedMalls] = useState([]);
  const [recommendedHotels, setRecommendedHotels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (longitude && latitude) {
      fetch(`${config.backendUrl}/places/recommend?longitude=${longitude}&latitude=${latitude}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.recommended_restaurants) {
            setRecommendedRestaurants(data.recommended_restaurants);
          }
          if (data.recommended_malls) {
            setRecommendedMalls(data.recommended_malls);
          }
          if (data.recommended_hotels) {
            setRecommendedHotels(data.recommended_hotels);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setError('Failed to fetch recommendations. Please try again later.');
        });
    }
  }, [longitude, latitude]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {recommendedRestaurants.length > 0 && (
        <>
          <h3>Recommended Restaurants</h3>
          <table className="recommend-table">
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
                            width: '200px',
                            height: '150px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                      <div>
                        <strong>Address:</strong> {restaurant.address}
                      </div>
                      <div>
                        <strong>Phone:</strong> {restaurant.phone}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </>
      )}

      {recommendedHotels.length > 0 && (
        <>
          <h3>Recommended Hotels</h3>
          <table className="recommend-table">
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
                            width: '200px',
                            height: '150px',
                            objectFit: 'cover',
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
        </>
      )}

      {recommendedMalls.length > 0 && (
        <>
          <h3>Recommended Shopping Malls</h3>
          <table className="recommend-table">
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
                            width: '200px',
                            height: '150px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default RecommendPlacesComponent;
