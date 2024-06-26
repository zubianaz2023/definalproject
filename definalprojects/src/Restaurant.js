import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from './config';
import './App.css';

function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 10;

  useEffect(() => {
    fetch(`${config.backendUrl}/restaurants`)
      .then(res => res.json())
      .then(data => {
        console.log("Data received:", data);
        setRestaurants(data.clusters);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = restaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  const nextPage = () => {
    if (currentPage < Math.ceil(restaurants.length / restaurantsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="restaurants">
          <table>
            <tbody>
              {currentRestaurants.map((restaurant, index) => (
                index % 2 === 0 ? (
                  <tr key={index}>
                    <td>
                      <div className="restaurant">
                        <h3>{restaurant.name}</h3>
                        <Link to={`/restaurants/recommend?longitude=${restaurant.longitude}&latitude=${restaurant.latitude}`}>
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            style={{
                              width: "200px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                        </Link>
                        <p>Rating: {restaurant.Rating}</p>
                        <p>Address: {restaurant.address}</p>
                      </div>
                    </td>
                    {currentRestaurants[index + 1] && (
                      <td>
                        <div className="restaurant">
                          <h3>{currentRestaurants[index + 1].name}</h3>
                          <Link to={`/restaurants/recommend?longitude=${currentRestaurants[index + 1].longitude}&latitude=${currentRestaurants[index + 1].latitude}`}>
                            <img
                              src={currentRestaurants[index + 1].image}
                              alt={currentRestaurants[index + 1].name}
                              style={{
                                width: "200px",
                                height: "150px",
                                objectFit: "cover",
                              }}
                            />
                          </Link>
                          <p>Rating: {currentRestaurants[index + 1].Ranking}</p>
                          <p>Address: {currentRestaurants[index + 1].address}</p>
                        </div>
                      </td>
                    )}
                  </tr>
                ) : null
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
            <button onClick={nextPage} disabled={currentPage === Math.ceil(restaurants.length / restaurantsPerPage)}>Next</button>
          </div>
        </div>
      </header>
    </div>
  );
}
export default Restaurant;
