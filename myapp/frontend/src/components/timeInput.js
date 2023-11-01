import React, { useState } from 'react';

function TimeInputComponent() {
  const [date, setDate] = useState(''); // State for date input
  const [time, setTime] = useState(''); // State for time input
  const [timezone, setTimezone] = useState('+07'); // State for timezone input

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleTimezoneChange = (e) => {
    setTimezone(e.target.value);
  };

  const formattedTime = `${date} ${time}${timezone}`;

  return (
    <div>
      <label>Date: </label>
      <input type="date" value={date} onChange={handleDateChange} />
      <br />
      <label>Time: </label>
      <input type="time" value={time} onChange={handleTimeChange} />
      <br />
      <label>Timezone: </label>
      <input type="text" value={timezone} onChange={handleTimezoneChange} />
      <br />
      <p>Formatted Time: {formattedTime}</p>
    </div>
  );
}

export default TimeInputComponent;
