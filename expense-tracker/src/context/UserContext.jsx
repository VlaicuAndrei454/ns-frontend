import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState("USD");

  // Function to update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Function to clear user data (e.g., on logout)
  const clearUser = () => {
    setUser(null);
  };

  // Update preferred currency
  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
        currency,
        updateCurrency,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
