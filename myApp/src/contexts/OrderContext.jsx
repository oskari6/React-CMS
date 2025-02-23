import { createContext, useContext } from "react";

const OrderContext = createContext();

export default function OrderProvider({ children }) {
  return <OrderContext.Provider value={{}}>{children}</OrderContext.Provider>;
}
