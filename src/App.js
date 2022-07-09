import React from 'react';
import logo from './logo.svg';
import './css/App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import TickUrTime from './TickUrTime.js';
import ScheduleForm from './ScheduleForm.js';
import LoginButton from './auth/LoginButton.js';
import LogoutButton from './auth/LogoutButton.js';
import { useAuth0 } from "@auth0/auth0-react";

function App() {
	const { user, isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
		return <div>Loading ...</div>;
	}
	return (
	<div>
		  <Container>
			<Row>
			{isAuthenticated && <LogoutButton />}
			{!isAuthenticated && <LoginButton />}
			</Row>
			<TickUrTime />
		  </Container>
	</div>
	);
}

export default App;
