import React, { useEffect, useContext } from "react";
import { LoginContext } from "../App";

const GoogleAuth = ({
  clientId,
  handleCredentialResponse,
  buttonId = "signInDiv",
  theme = "outline",
  size = "large",
}) => {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);

  useEffect(() => {
    localStorage.clear();
    setLoggedIn(false);
    const initializeGoogleSignIn = () => {
      /*global google*/
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(document.getElementById(buttonId), {
        theme: theme,
        size: size,
      });
    };

    // Check if the google object is available and call the function
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      window.onload = initializeGoogleSignIn;
    }
  }, [clientId, handleCredentialResponse, buttonId, theme, size]);
  return <div id={buttonId}></div>;
};

export default GoogleAuth;
