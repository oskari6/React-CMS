import { useState, useContext } from "react";
import { baseUrl } from "../Shared";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../App";

export default function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loggedIn, setLoggedIn] = useContext(LoginContext);

  const location = useLocation();
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    const url = baseUrl + "/api/token/";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.access && data.refresh) {
        localStorage.setItem("access", data.access); //save credentials to local storage
        localStorage.setItem("refresh", data.refresh);
        setLoggedIn(true);
        console.log("Login succeesful, Logged In Status:", loggedIn);
        navigate(
          location?.state?.previousUrl
            ? location.state.previousUrl
            : "/customers"
        );
      } else {
        console.error("Login failed: ", data);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  }
  return (
    <form
      className="m-2 w-full max-w-sm mx-auto mt-20 flex flex-col items-center justify-center"
      id="customer"
      onSubmit={login}
    >
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label for="username">Username</label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label for="password">Password</label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
      </div>
      <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
        Login
      </button>
    </form>
  );
}