import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';  // Import useNavigate

const CancelPage = () => {
    const navigate = useNavigate();  // Hook for navigation

    // Define the handleGoBack function
    const handleGoBack = () => {
        navigate(-1);  // This will take the user back to the previous page
    };

    return (
        <div>
            <h1>Payment Cancelled</h1>
            <p>Your payment was not completed. If this was an error, please try again.</p>
            <button onClick={handleGoBack}>Return Home</button>
        </div>
    );
};

export default CancelPage;
