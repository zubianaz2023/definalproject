import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecommendComponent from './RecommendComponent';
import Restaurant from './Restaurant';
import config from './config';

function App() {
  return (
    <Router>
      <div>
        <h1>Best Restaurants in the Gwangju</h1>
        <Routes>
          <Route path="/" element={<Restaurant />} />
          <Route path="/recommends" element={<RecommendComponent />} />
          
        </Routes>
      </div>
    </Router>
  );
}

 
  


export default App;
