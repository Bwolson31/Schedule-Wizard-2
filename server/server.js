const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const cors = require('cors');
const { authMiddleware } = require('./auth/auth'); 
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000; 
// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://schedule-wizard-2.onrender.com'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-apollo-operation-name'],
};

app.use(cors(corsOptions));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Debugging middleware to track the flow
app.use((req, res, next) => {
  console.log("Middleware 1 executed");
  next();
});

// Apply custom JWT authentication middleware
app.use(authMiddleware);

// Debugging middleware to verify `req.user` is set
app.use((req, res, next) => {
  console.log("Middleware 2 executed after authMiddleware");
  console.log("req.user after authMiddleware:", req.user);
  next();
});

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    console.log("Inside context function - req.user:", req.user);
    return { user: req.user || null };
  },
  formatError: (err) => {
    console.error("GraphQL Error:", err);
    return err;
  },
});

// Start the Apollo server and set up middleware
async function startServer() {
  try {
    await server.start();
    app.use('/graphql', expressMiddleware(server));

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http${process.env.NODE_ENV === 'production' ? 's' : ''}://${process.env.NODE_ENV === 'production' ? 'schedule-wizard-2.onrender.com' : 'localhost'}:${PORT}/graphql`);
      });
    });

  } catch (error) {
    console.error("Error starting Apollo Server:", error);
  }
}

// Start the server
startServer();

