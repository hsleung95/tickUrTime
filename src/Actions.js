import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Actions(props) {
		return (
			<Row className="rowAction">
				<Col xs="6" className="text-center">
					<Button onClick={props.setTimer} style={{color: "white", backgroundColor: "#000000", borderColor: "grey", borderWidth: "2px"}}>
						{(props.timer == 'timer') ? 'Clock Mode' : 'Timer Mode'}
					</Button>
				</Col>
				<Col xs="6" className="text-center">
					{props.count<= 0 && <Button disabled={props.activity == null || props.counting} style={{color: "white", backgroundColor: "#0C4160", borderColor: "grey", borderWidth: "2px"}} onClick={props.startCounting}>
						Start!
					</Button>}
					{props.count > 0 && <Button disabled={props.count <= 0} variant="danger" onClick={() => {props.stopCounting();}}>
						Stop!
					</Button>}
				</Col>
			</Row>
		);
}

export default Actions;
