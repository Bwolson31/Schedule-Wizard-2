const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const cors = require('cors');
const { authMiddleware } = require('./auth/auth');

// Configuring dotenv to load different .env files based on NODE_ENV
require('dotenv').config({
  path: `./.env.${process.env.NODE_ENV}`
});

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3003;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://schedule-wizard-2.onrender.com'],
    credentials: true, // to support cookies
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  
  app.use(cors(corsOptions));
  

app.use(cors(corsOptions));

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: authMiddleware(req)
  }),
});

// Start the Apollo server and set up middleware
async function startServer() {
  await server.start();

  // Apply the Apollo GraphQL middleware
  app.use('/graphql', expressMiddleware(server));

  // Serve static files and SPA on production environment
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Database connection and server start
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http${process.env.NODE_ENV === 'production' ? 's' : ''}://${process.env.NODE_ENV === 'production' ? 'schedule-wizard-2.onrender.com' : 'localhost'}:${PORT}/graphql`);
    });
  });
}

startServer();



