import React from "react";
import Button from 'react-bootstrap/Button';
import { useAuth0 } from "@auth0/auth0-react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './../css/Login.scss'
import { Card } from "react-bootstrap";



const LoginButton = () => {
  const { loginWithPopup } = useAuth0();

  return (
    <Container fluid className="col-center">
        <Card className="LoginBox">
            <Card.Body>
                <Card.Title>Log in</Card.Title>
                <Card.Text>Log in to tick Ur Time!</Card.Text>
                <Button onClick={() => loginWithPopup()}>Log In</Button>
                <Card.Text>Sign Up for more resources</Card.Text>
            </Card.Body>
        </Card>
    </Container>
  );
};

export default LoginButton;
