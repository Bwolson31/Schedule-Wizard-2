const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'mysecretssshhhhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function (req, res, next) {
    console.log("authMiddleware executed at the start.");

    let token = req.headers.authorization || req.query.token;
    console.log("Authorization header:", req.headers.authorization);

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      console.log('No token found');
      return next();
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('Token verified successfully, user:', req.user);
    } catch (error) {
      console.error('Invalid token:', error);
    }
    console.log('Moving to next middleware with user:', req.user);
    
    next();
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
