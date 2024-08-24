import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    const token = this.getToken();
    if (token) {
      return decode(token);
    }
    return null;
  }

  loggedIn() {
    const token = this.getToken();
    const isExpired = token ? this.isTokenExpired(token) : true;
    console.log("Token valid: ", !isExpired);
    return !!token && !isExpired;
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      console.log("Decoded token:", decoded);
      console.log("Token expiry timestamp:", decoded.exp);
      console.log("Current timestamp:", Date.now() / 1000);

      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('id_token');  
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      return true;
    }
  }

  getToken() {
    const token = localStorage.getItem('id_token');
    console.log("Retrieving token from storage:", token);
    return token;
  }

  login(idToken) {
    try {
      console.log("Logging in, setting token:", idToken);
      localStorage.setItem('id_token', idToken);
      const storedToken = localStorage.getItem('id_token');
      console.log("Token set in storage:", storedToken);
      if (storedToken !== idToken) {
        console.error("Token storage failed!");
      }
      window.location.assign('/');
    } catch (error) {
      console.error("Error storing token:", error);
    }
  }

  logout() {
    console.log("Logging out, removing token.");
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();

