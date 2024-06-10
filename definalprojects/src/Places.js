import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from './config';
import './App.css';

function Places() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 10;

  useEffect(() => {
    fetch(`${config.backendUrl}/places`)
      .then(res => res.json())
      .then(data => {
        console.log("Data received:", data);
        setPlaces(data.clusters);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = places.slice(indexOfFirstPlace, indexOfLastPlace);

  const nextPage = () => {
    if (currentPage < Math.ceil(places.length / placesPerPage)) {
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
        <div className="places">
          <table>
            <tbody>
              {currentPlaces.map((place, index) => (
                index % 2 === 0 ? (
                  <tr key={index}>
                    <td>
                      <div className="place">
                        <h3>{place.name}</h3>
                        <Link to={`/places/recommend?longitude=${place.longitude}&latitude=${place.latitude}`}>
                          <img
                            src={place.image}
                            alt={place.name}
                            style={{
                              width: "200px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                        </Link>
                        
                        <p>Address: {place.address}</p>
                      </div>
                    </td>
                    {currentPlaces[index + 1] && (
                      <td>
                        <div className="place">
                          <h3>{currentPlaces[index + 1].name}</h3>
                          <Link to={`/places/recommend?longitude=${currentPlaces[index + 1].longitude}&latitude=${currentPlaces[index + 1].latitude}`}>
                            <img
                              src={currentPlaces[index + 1].image}
                              alt={currentPlaces[index + 1].name}
                              style={{
                                width: "200px",
                                height: "150px",
                                objectFit: "cover",
                              }}
                            />
                          </Link>
                          <p>Rating: {currentPlaces[index + 1].Rating}</p>
                          <p>Address: {currentPlaces[index + 1].address}</p>
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
            <button onClick={nextPage} disabled={currentPage === Math.ceil(places.length / placesPerPage)}>Next</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Places;
