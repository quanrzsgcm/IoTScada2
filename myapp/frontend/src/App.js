import React from 'react';
import './App.css';
import Comds from './components/testcom';
import BasicExample from './components/accord';
import ButtonsExample from './components/buttonexample';
import SelectBasicExample from './components/form';
import VariationsExample from './components/variationexample';
import CreatePM from './components/CreatePM';
import background from "./images/jojo.jpg";
import App2 from './components/sidebar';

function App() {
  const backgroundImageStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'fill',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'filled',
  };

  return (
    <div style={backgroundImageStyle}>
      <main className="content">
        <h1 className="text-success text-uppercase text-center my-4">
          Iot Management System
        </h1>
        <div>
          <VariationsExample />
        </div>
        <div>
          <CreatePM />
        </div>
        <div>
          <App2 />
        </div>
        {/* Rest of your content */}
      </main>
    </div>
  );
}

export default App;
