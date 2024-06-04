import React, { useState } from 'react';

function RecommendComponent() {
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = () => {
    console.log("Input value:", inputValue);
  };

  return (
    <div>
      <h2>Simple Input Example</h2>
      <div>
        <label htmlFor="inputField">Enter something:</label>
        <input
          type="text"
          id="inputField"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Enter something"
          required
        />
      </div>
      <button onClick={handleButtonClick}>Submit</button>
    </div>
  );
}

export default RecommendComponent;
