import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../auth/auth';

// Create a context to hold user data
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Provider component to wrap around parts of the app that need access to user data
export const UserProvider = ({ children }) => {
  // State to store the current user
  const [currentUser, setCurrentUser] = useState(null);

  // useEffect to fetch user profile when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      // Get the user profile from AuthService
      const profile = AuthService.getProfile();
      // Set the current user state with the profile data
      setCurrentUser(profile);
    };

    fetchUser();
  }, []);

  return (
    // Provide the current user and a method to update it to the rest of the app
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
