import React from 'react';
import { HashRouter, Route, Switch, Link } from 'react-router-dom';

import RecommendComponent from './RecommendComponent';
import Restaurant from './Restaurant';
import config from './config';

function App() {
  return (
    <HashRouter>
      <div>
        <h1>Best Restaurants in the Gwangju</h1>
       <Routes>
          <Route path="/" element={<Restaurant />} />
          <Route path="/recommend" element={<RecommendComponent />} />
          
     </Routes>
      </div>
    </HashRouter>
  );
}

 
  


export default App;
