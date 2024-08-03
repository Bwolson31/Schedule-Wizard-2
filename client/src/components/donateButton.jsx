import React from "react";
import { Button } from 'react-bootstrap';
import { loadStripe } from "@stripe/stripe-js";


const DonationButton = ({ itemID, ammount }) => {
  const handleClick = async (event) => {
    const stripe = await stripePromise;
    stripe
      .redirectToCheckout({
        lineItems: [{ price: itemID, quantity: 1 }],
        mode: "payment",
        successUrl: window.location.protocol + "//localhost:3000/profile",
        cancelUrl: window.location.protocol + "//localhost:3000/profile",
        submitType: "donate",
      })
      .then(function (result) {
        if (result.error) {
          console.log(result);
        }
      });
  };
  return (
    <Button className="animated-button justify-content-end mb-3" variant="success" onClick={handleClick}>
      Donate {ammount}$
    </Button>
  );
};

export default DonationButton;
