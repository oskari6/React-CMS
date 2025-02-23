import { createContext, useContext } from "react";

const ItemContext = createContext();

export default function ItemProvider({ children }) {
  return <ItemContext.Provider value={{}}>{children}</ItemContext.Provider>;
}
