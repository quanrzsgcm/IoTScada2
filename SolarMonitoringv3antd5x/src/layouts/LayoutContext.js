import React, { createContext, useContext, useState } from 'react';

// Create the context
const ToggledContext = createContext();

// Create a custom hook to access the toggled state
export const useToggled = () => useContext(ToggledContext);

// Provider component
export const ToggledProvider = ({ children }) => {
  const [toggled, setToggled] = useState(true);

  return (
    <ToggledContext.Provider value={{ toggled, setToggled }}>
      {children}
    </ToggledContext.Provider>
  );
};
