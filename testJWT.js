const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const token = jwt.sign({ data: 'data' }, secret, { expiresIn: '1h' });

console.log('Token:', token);

try {
  const decoded = jwt.verify(token, secret);
  console.log('Decoded:', decoded);
} catch (error) {
  console.error('Error verifying token:', error);
}