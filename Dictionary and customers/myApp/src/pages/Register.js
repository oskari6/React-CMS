import { useState, useContext } from "react";
import { baseUrl } from "../Shared";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../App";
import GoogleAuth from "../components/GoogleAuth";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function Register() {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  const location = useLocation();
  const navigate = useNavigate();

  const handleCredentialResponse = (response) => {
    const idToken = response.credential;

    fetch("http://localhost:8000/api/auth/google/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: idToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log("Error:", data.error);
        } else {
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);

          setUsername({ email: data.email, name: data.name });
          setLoggedIn(true);

          navigate(
            location?.state?.previousUrl
              ? location.state.previousUrl
              : "/customers"
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function login(e) {
    e.preventDefault();
    const url = baseUrl + "/api/register/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("access", data.access); //save credentials to local storage
        localStorage.setItem("refresh", data.refresh);
        setLoggedIn(true);
        navigate(
          location?.state?.previousUrl
            ? location.state.previousUrl
            : "/customers"
        );
      });
  }

  return (
    <div className="m-2 w-full max-w-sm mx-auto mt-20 flex flex-col items-center justify-center">
      <form
        className="m-2 w-full max-w-sm mx-auto mt-20 flex flex-col items-center justify-center"
        id="customer"
        onSubmit={login}
      >
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/4">
            <label for="email">Email</label>
          </div>
          <div className="md:w-3/4">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
        </div>
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
          Register
        </button>
      </form>
      <div>
        <GoogleAuth
          clientId={clientId}
          handleCredentialResponse={handleCredentialResponse}
        />
      </div>
    </div>
  );
}
