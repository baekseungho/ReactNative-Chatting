import React, { useState, createContext } from "react";

const ProgressContext = createContext({
  inProgress: false,
  spinner: () => {},
});

const ProgressProvider = ({ children }) => {
  const [inProgress, setInprogress] = useState(false);
  const spinner = {
    start: () => setInprogress(true),
    stop: () => setInprogress(false),
  };
  const value = { inProgress, spinner };
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export { ProgressContext, ProgressProvider };
