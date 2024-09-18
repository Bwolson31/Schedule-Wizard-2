import React, { useEffect, useState } from 'react';
import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { UserProvider } from './contexts/UserContext.jsx';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

console.log('Stripe promise:', stripePromise);


console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://schedule-wizard-2.onrender.com/graphql' 
  : 'http://localhost:3003/graphql';

  
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_APP_GRAPHQL_URL || API_URL,
});



const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  useEffect(() => {
    loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
      .then(stripe => {
        console.log('Stripe initialized:', stripe);
      })
      .catch(error => {
        console.error('Error initializing Stripe:', error);
      });
  }, []);


  return (
    
    <ApolloProvider client={client}>
      <UserProvider> {/* Wrap the entire application with UserProvider */}
      <Elements stripe={stripePromise}>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <Navbar /> {/* Navbar can now use the context for authentication */}
          <Container className="main-content">
            <div className="container">
              <Outlet /> {/* Used for rendering child components */}
            </div>
          </Container>
          <Footer />
        </div>
        </Elements>
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
