const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'mysecretssshhhhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function (req, res, next) {

    let token = req.headers.authorization || req.query.token;
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return next();
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (error) {
      console.error('Invalid token:', error);
    }
    
    next();
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
