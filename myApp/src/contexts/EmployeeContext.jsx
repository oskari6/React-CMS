import { createContext, useContext } from "react";

const EmployeeContext = createContext();

export default function EmployeeProvider({ children }) {
  return (
    <EmployeeContext.Provider value={{}}>{children}</EmployeeContext.Provider>
  );
}
