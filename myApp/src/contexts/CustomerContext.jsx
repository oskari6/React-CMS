import { createContext, useContext } from "react";

const CustomerContext = createContext();

export default function CustomerProvider({ children }) {
  return (
    <CustomerContext.Provider value={{}}>{children}</CustomerContext.Provider>
  );
}
