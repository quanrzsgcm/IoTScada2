import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../App.css';
import VariationsExample from '../components/variationexample';
import background from "../images/jojo.jpg";
import DarkExample from '../components/darkTable';
import DataFetchingComponent from '../components/dataFetching';

function MonitorPage() {
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
                <DarkExample />
            </div>
            <div>
                <DataFetchingComponent />
            </div>
        </main>

    );
}

export default MonitorPage;
