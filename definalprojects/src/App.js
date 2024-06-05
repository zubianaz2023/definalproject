import React from 'react';
import { HashRouter, Route, Routes, Link } from 'react-router-dom';

import RecommendComponent from './RecommendComponent';
import Restaurant from './Restaurant';

function App() {
  return (
    <HashRouter>
      <div>
        <h1>Best Restaurants in Gwangju</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/places">Recommend</Link></li>
            <li><Link to="/hotels">Recommend</Link></li>
            <li><Link to="/restaurants">Recommend</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Restaurant />} />
          <Route path="/places" element={<Places />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/restaurants" element={<Restaurant />} />
          <Route path="/recommend" element={<RecommendComponent />} />
          
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
