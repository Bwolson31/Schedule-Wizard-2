// import React, { useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadstripe () {
//     'dsifjads;ghfasdkhgjs';
// }


// const CheckoutForm = () => {
//   const [amount, setAmount] = useState(0);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleCheckout = async (event) => {
//     event.preventDefault();

//     const stripe = await stripePromise;

//     try {
//       const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Authorization': 'Bearer TODO'
        
//         },
//         body: new URLSearchParams({
//           'payment_method_types[0]': 'card',
//           'line_items[0][price_data][currency]': 'usd',
//           'line_items[0][price_data][product_data][name]': 'Donation',
//           'line_items[0][price_data][unit_amount]': (amount * 100).toString(), // Amount in cents
//           'line_items[0][quantity]': '1',
//           'mode': 'payment',
//           'success_url': window.location.origin + '/success',
//           'cancel_url': window.location.origin + '/cancel',
//         }),
//       });

//       const session = await response.json();

//       if (response.ok) {
//         const { id } = session;
//         const result = await stripe.redirectToCheckout({ sessionId: id });

//         if (result.error) {
//           setErrorMessage(result.error.message);
//         }
//       } else {
//         setErrorMessage(session.error.message);
//       }
//     } catch (error) {
//       setErrorMessage(error.message);
//     }
//   };

//   return (
//     <form onSubmit={handleCheckout}>
//       <label>
//         Donation Amount:
//         <input
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           required
//         />
//       </label>
//       {errorMessage && <div>{errorMessage}</div>}
//       <button type="submit">
//         Donate Now
//       </button>
//     </form>
//   );
// };

// export default CheckoutForm;
