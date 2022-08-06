import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Actions(props) {
		return (
			<Row className="rowAction">
				<Col xs="6" className="text-center">
					<Button onClick={props.setTimer}>
						{(props.timer == 'timer') ? 'clock' : 'timer'}
					</Button>
				</Col>
				<Col xs="6" className="text-center">
					{props.count<= 0 && <Button disabled={props.activity == null || props.counting} variant="success" onClick={props.startCounting}>
						start
					</Button>}
					{props.count > 0 && <Button disabled={props.count <= 0} variant="danger" onClick={() => {props.stopCounting();}}>
							stop
					</Button>}
				</Col>
			</Row>
		);
}

export default Actions;
