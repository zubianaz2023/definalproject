import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import config from './config'; // Ensure this imports the correct config file

function RecommendRestaurantsComponent() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const longitude = query.get('longitude');
  const latitude = query.get('latitude');
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [recommendedMalls, setRecommendedMalls] = useState([]);
  const [recommendedHotels, setRecommendedHotels] = useState([]);

  useEffect(() => {
    if (longitude && latitude) {
      fetch('${config.backendUrl}/restaurants/recommend?longitude=${longitude}&latitude=${latitude}')

        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.recommended_places) {
            setRecommendedPlaces(data.recommended_places);
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
        });
    }
  }, [longitude, latitude]);

  return (
    <div>
      {recommendedPlaces.length > 0 && (
        <>
          <h3>Recommended Places</h3>
          <table className="recommend-table">
            <tbody>
              <tr>
                {recommendedPlaces.slice(0, 5).map((place, index) => (
                  <td key={index}>
                    <div className="recommend-item">
                      <div>
                        <strong>Name:</strong> {place.Name}
                      </div>
                      <div>
                        <img
                          src={place.image}
                          alt={place.Name}
                          style={{
                            width: "200px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div>
                        <strong>Location:</strong> {place.Location}
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
        </>
      )}
    </div>
  );
}

export default RecommendRestaurantsComponent;
