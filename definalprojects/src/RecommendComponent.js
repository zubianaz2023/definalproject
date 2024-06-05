import React from 'react';
import { useLocation } from 'react-router-dom';

function RecommendComponent() {
  const query = new URLSearchParams(useLocation().search);
  const longitude = query.get('longitude');
  const latitude = query.get('latitude');

  // Fetch and display the detailed information about the restaurant using longitude and latitude
  return (
    <div>
      <h2>Recommend Component</h2>
      <p>Longitude: {longitude}</p>
      <p>Latitude: {latitude}</p>
      {/* You can add more details or fetch additional data about the restaurant using the longitude and latitude */}
    </div>
  );
}

export default RecommendComponent;
