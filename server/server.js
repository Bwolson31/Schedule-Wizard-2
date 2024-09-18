require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const cors = require('cors');
const { authMiddleware } = require('./auth/auth'); 
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

console.log(process.env);

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);



// Initialize Express
const app = express();
const PORT = process.env.PORT || 3003;

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
  next();
});

// Apply custom JWT authentication middleware
app.use(authMiddleware);

// Debugging middleware to verify `req.user` is set
app.use((req, res, next) => {
  next();
});

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return { user: req.user || null };
  },
  formatError: (err) => {
    return err;
  },
});

// Start the Apollo server and set up middleware
async function startServer() {
  try {
    await server.start();
    console.log("Apollo Server started");

    app.use('/graphql', expressMiddleware(server, {
      context: async ({ req }) => {
        return { user: req.user || null };
      }
    }));
  
    // Serve static files in production
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
      });
    });
  } catch (error) {
    console.error("Error starting Apollo Server:", error);
  }
}

// Start the server
startServer();



