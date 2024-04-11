import React, { useContext, useEffect } from 'react'
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
  

    useEffect(() => {
        // Check if the user is logged in and navigate to the desired route
        if (user) {
            navigate('/site-monitor/siteview');
        }
    }, [user]);

    return (user ? (
        <div>
            <p>You are logged in to the homepage!</p>
        </div>
    ) : (
        <div>
            <p>You are not logged in, redirecting...</p>
        </div>
    )
    )
}

export default HomePage