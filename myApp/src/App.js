import Employees from "./pages/Employees";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Customers from "./pages/Customers";
import Dictionary from "./pages/Dictionary";
import Definition from "./pages/Definition";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import Customer from "./pages/Customer";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import { createContext, useState, useEffect } from "react";
import { baseURL } from "./Shared";
import Register from "./pages/Register";
import Layout from "./components/layout/Layout";
import Items from "./pages/Items";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
export const LoginContext = createContext();

const queryClient = new QueryClient();

function App() {
  //check storage for an access token -> may be expired
  //long term goal, use Refresh token and if it works, stay logged in, otherwise send to login page
  const [loggedIn, setLoggedIn] = useState(localStorage.access ? true : false);
  useEffect(() => {
    function refreshTokens() {
      if (localStorage.refresh) {
        const url = baseURL + "/api/token/refresh/";
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: localStorage.refresh,
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            localStorage.access = data.access;
            localStorage.refresh = data.refresh;
            setLoggedIn(true); //precautionary
          });
      }
    }
    const minute = 1000 * 60;
    refreshTokens();
    setInterval(refreshTokens, minute * 3); //adjust refresh time
  }, []);

  function changeLoggedIn(value) {
    if (value === false) {
      localStorage.clear();
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LoginContext.Provider value={[loggedIn, changeLoggedIn]}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="employees" element={<Employees />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<Customer />} />
              <Route path="customers/:id/orders" element={<Orders />} />
              <Route path="orders" element={<Orders />} />
              <Route path="items" element={<Items />} />
              <Route path="dictionary" element={<Dictionary />} />
              <Route path="dictionary/:search" element={<Definition />} />
              <Route path="404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
              <Route path="login" element={<Login />} />
              <Route path="api/register" element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoginContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
