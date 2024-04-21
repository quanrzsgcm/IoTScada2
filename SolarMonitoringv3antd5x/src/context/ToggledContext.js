// Create a new context
import React, { createContext, useState, useContext } from 'react';

const ToggledContext = createContext();

export const ToggledProvider = ({ children }) => {
  const [toggled, setToggled] = useState(true);

  return (
    <ToggledContext.Provider value={{ toggled, setToggled }}>
      {children}
    </ToggledContext.Provider>
  );
};

export const useToggled = () => useContext(ToggledContext);
