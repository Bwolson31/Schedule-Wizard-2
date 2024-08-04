const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const cors = require('cors');
const { authMiddleware } = require('./auth/auth');
require('dotenv').config();

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3003;
const app = express();

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://schedule-wizard-2.onrender.com'], 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-apollo-operation-name'],
    credentials: true,
  };
  

// Start the Apollo server
const startApolloServer = async () => {
  await server.start();

  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: ({ req }) => authMiddleware({ req }),
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at https://${process.env.NODE_ENV === 'production' ? 'schedule-wizard-2.onrender.com' : 'localhost'}:${PORT}/graphql`);
    });
  });
};
  
// Call the async function to start the server
startApolloServer();
