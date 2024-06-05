import React from 'react';
import { HashRouter, Route, Routes, Link } from 'react-router-dom';

import RecommendComponent from './RecommendComponent';
import Restaurant from './Restaurant';
import Places from './Places';
import Hotels from './Hotels';
import ShoppingMalls from './ShoppingMalls';

function App() {
  return (
    <HashRouter>
      <div>
        <h1>Best Restaurants in Gwangju</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/places">Places</Link></li>
            <li><Link to="/hotels">Hotels</Link></li>
            <li><Link to="/restaurants">Restaurants</Link></li>
            <li><Link to="/shoppingmalls">Shopping Malls</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Restaurant />} />
          <Route path="/places" element={<Places />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/restaurants" element={<Restaurant />} />
          <Route path="/shoppingmalls" element={<ShoppingMalls />} />
          <Route path="/recommend" element={<RecommendComponent />} />
          
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
