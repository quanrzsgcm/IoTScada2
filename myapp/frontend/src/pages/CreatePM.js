import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../App.css';
import VariationsExample from '../components/variationexample';
import CreatePM from '../components/CreatePM';
import background from "../images/jojo.jpg";
import App2 from '../components/sidebar';
import Home from '../pages/HomePage';
import MyComponent from '../components/routingButton';

function CreatePMPage() {
    const backgroundImageStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'fill',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'filled',
    };

    return (
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
                <MyComponent />
            </div>
            {/* Rest of your content */}
        </main>

    );
}

export default CreatePMPage;
