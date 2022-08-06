import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './css/ActivityList.scss';

function ActivityList(props) {
	return (
		<Modal className="activityList" show={props.showActivityList}>
			<Modal.Body>
				<br />
				<div className="list">
					{props.activities.map((activity, index) => (
						<Row key={index}>
							<Button className="btnActivity" onClick={() => {props.setActivity(activity);props.toggleActivityList();}}>
								{activity.name}
							</Button>
						</Row>
					))}
				</div>
				<br />
				<Row>
					<div className="text-center">
						add activities
					</div>
				</Row>
				<br />
				<Row>
					<Col xs="12"  className="text-center">
						<input id="activityInput" />
					</Col>
				</Row>
				<br />
				<Row>
					<Col xs="6" className="text-center">
						<Button className="btnAction" onClick={() => {props.addActivity(document.getElementById("activityInput").value);}}>
							add
						</Button>
					</Col>
					<Col xs="6" className="text-center">
						<Button className="btnAction" variant="danger" onClick={props.toggleActivityList}>
							cancel
						</Button>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
}

export default ActivityList;