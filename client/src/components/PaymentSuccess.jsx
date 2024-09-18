import React from 'react';
import { useLocation } from 'react-router-dom';

function PaymentSuccess() { 
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get('amount');


  return (
    <div className="payment-success">
      <h1>Thank You for Your Donation!</h1>
      <p>Your support is greatly appreciated.</p>
      <div className="details">
        <h2>Transaction Details</h2>
        <p><strong>Amount:</strong> {amount}</p>
        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
        <p>If you have any questions about your donation, please contact us at <a href="mailto:support@fakename.com">support@fakename.com</a>.</p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
