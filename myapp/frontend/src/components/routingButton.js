import React from 'react';
import { useNavigate  } from 'react-router-dom';

function MyComponent() {
  const history = useNavigate ();

  const handleButtonClick = () => {
    history.push('/home');
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Go to /home</button>
    </div>
  );
}

export default MyComponent;
