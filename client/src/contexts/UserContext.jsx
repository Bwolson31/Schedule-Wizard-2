import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../auth/auth';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
      const checkUser = async () => {
          if (AuthService.loggedIn()) {
              const profile = AuthService.getProfile();
              setCurrentUser(profile);
          } else {
              setCurrentUser(null);
          }
      };

      checkUser();

      // Set up an interval to periodically check the login status
      const interval = setInterval(checkUser, 60000); // Check every minute

      return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Log current user updates for debugging
  useEffect(() => {
    console.log("Current user updated:", currentUser);
  }, [currentUser]);  // This effect is purely for logging purposes

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};


