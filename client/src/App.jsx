import React, { useEffect } from 'react';
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

import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { UserProvider } from './contexts/UserContext.jsx';
import AuthService from './auth/auth.js';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_APP_GRAPHQL_URL || 'http://localhost:3003/graphql',
});


console.log("API URI: ", import.meta.env.VITE_APP_GRAPHQL_URL);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  console.log("Client sending token:", token);

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
    console.log("Is the user logged in?", AuthService.loggedIn());
  }, []);

  return (
    <ApolloProvider client={client}>
      <UserProvider> {/* Wrap the entire application with UserProvider */}
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
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
