import React, { useState } from 'react';
import '../assets/styles/SiteView.scss'; // Import your CSS file for styling

function SelectTime() {
  const [selectedButton, setSelectedButton] = useState('Daily');

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <div className="select-time-container">
      <div className="selected-box">Selected Button: {selectedButton}</div>
      <div className="button-container">
        <button
          className={selectedButton === 'Daily' ? 'selected' : ''}
          onClick={() => handleButtonClick('Daily')}
        >
          Daily
        </button>
        <button
          className={selectedButton === 'Monthly' ? 'selected' : ''}
          onClick={() => handleButtonClick('Monthly')}
        >
          Monthly
        </button>
        <button
          className={selectedButton === 'Yearly' ? 'selected' : ''}
          onClick={() => handleButtonClick('Yearly')}
        >
          Yearly
        </button>
        <button
          className={selectedButton === 'Total' ? 'selected' : ''}
          onClick={() => handleButtonClick('Total')}
        >
          Total
        </button>
      </div>
    </div>
  );
}

export default SelectTime;
