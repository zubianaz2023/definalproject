import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from './config';
import './App.css';

function Places() {
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 10;

  useEffect(() => {
    fetch(`${config.backendUrl}/`)
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
                        <Link to={`/recommend?longitude=${restaurant.longitude}&latitude=${restaurant.latitude}`}>
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
