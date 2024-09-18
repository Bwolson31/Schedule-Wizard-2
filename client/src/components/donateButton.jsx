import React from "react";
import { Button } from 'react-bootstrap';
import { CREATE_DONATION_SESSION } from "../graphql/mutations";
import { useMutation } from '@apollo/client';





const DonationButton = ({ amount }) => {
  const [createDonationSession] = useMutation(CREATE_DONATION_SESSION);

  const handleClick = async () => {
    try {
      const { data } = await createDonationSession({ variables: { amount: parseFloat(amount) } });
      if (data.createDonationSession.error) {
        console.error('Error creating session:', data.createDonationSession.error);
      } else if (data.createDonationSession.sessionId) {
        const checkoutUrl = `https://checkout.stripe.com/pay/${data.createDonationSession.sessionId}`;
        console.log('Redirecting to:', checkoutUrl);
        window.location = checkoutUrl;
      } else {
        console.error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Network or server error:', error);
    }
  };

  return (
    <Button onClick={handleClick} variant="success">
      Donate ${amount}
    </Button>
  );
};

export default DonationButton;