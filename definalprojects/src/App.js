import React from 'react';
import { HashRouter , Route, Routes,Link } from 'react-router-dom';
import RecommendComponent from './RecommendComponent';
import Restaurant from './Restaurant';
import config from './config';

function App() {
  return (
    <HashRouter>
      <div>
        <h1>Best Restaurants in the Gwangju</h1>
       <Switch>
          <Route path="/" element={<Restaurant />} />
          <Route path="/recommend" element={<RecommendComponent />} />
          
     </Switch>
      </div>
    </HashRouter>
  );
}

 
  


export default App;
