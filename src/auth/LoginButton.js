import React from "react";
import Button from 'react-bootstrap/Button';
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithPopup } = useAuth0();

  return <Button onClick={() => loginWithPopup()}>Log In</Button>;
};

export default LoginButton;
