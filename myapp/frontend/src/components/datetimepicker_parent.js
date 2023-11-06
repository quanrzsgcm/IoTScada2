import React, { useState } from 'react';
import TimeSelect from './datetimepicker';

function Picker() {
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <div>
      <h1>Select Time</h1>
      <TimeSelect value={selectedTime} onChange={setSelectedTime} />
      <p>Selected Time: {selectedTime}</p>
    </div>
  );
}

export default Picker;
