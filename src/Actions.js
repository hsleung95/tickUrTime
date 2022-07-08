import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Actions(props) {
		return (
			<Row className="rowAction">
				<Col xs="4" className="text-center">
					<Button onClick={props.setTimer}>
						{(props.timer == 'timer') ? 'clock' : 'timer'}
					</Button>
				</Col>
				<Col xs="4" className="text-center">
					<Button disabled={props.activity == null || props.counting} variant="success" onClick={props.startCounting}>
						{(props.count == 0) ? 'start' : 'continue'}
					</Button>
				</Col>
				<Col xs="4" className="text-center">
					<Button disabled={props.count <= 0} variant="danger" onClick={() => {props.stopCounting();}}>
							stop
					</Button>		
				</Col>
			</Row>
		);
}

export default Actions;
