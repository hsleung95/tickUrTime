import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {formatDate, formatTime, formatSeconds, formatDateVal} from '../../utils/DateUtils.js';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import Controller from '../../Controller.js';
import './../css/TimeForm.scss';

class TimeForm extends React.Component {
	
	constructor(props) {
		super(props);
		this.setCountDown = props.setCountDown.bind(this);
		this.toggleShowTimeForm = props.toggleShowTimeForm.bind(this);
		this.setStartingTime = props.setStartingTime.bind(this);
	}
	
	render() {
		return (
			<Modal className="timeForm" show={this.props.showTimeForm} onHide={this.toggleShowTimeForm}>
				<Modal.Body>
					<br />
					<Row>
						<Col xs="12" className="text-center">
							<BootstrapSwitchButton
								checked={(this.props.countDown == 1)}
								onlabel='Count Up'
								onstyle='success'
								offlabel='Count Down'
								offstyle='danger'
								style="w-100"
								onChange={(checked) => {
									this.setCountDown(checked);
								}}
							/>
						</Col>
					</Row>
					<br />
					<div className="timeList">
						{(this.props.countDown == -1) && <>
						<Row>
							<Col xs="4" className="text-center">
								<Button className="modalBtn btnTime" variant="danger" onClick={() => {this.setStartingTime(900);}}>
									15min
								</Button>
							</Col>
							<Col xs="4" className="text-center">
								<Button className="modalBtn btnTime" variant="danger" onClick={() => {this.setStartingTime(1800);}}>
									30min
								</Button>
							</Col>
							<Col xs="4" className="text-center">
								<Button className="modalBtn btnTime" variant="danger" onClick={() => {this.setStartingTime(2700);}}>
									45min
								</Button>
							</Col>
						</Row>
						<br />
						<Row>
							<Col xs="4" className="text-center">
								<Button className="modalBtn btnTime" variant="danger" onClick={() => {this.setStartingTime(3600);}}>
									1hr
								</Button>
							</Col>
							<Col xs="4" className="text-center">
								<Button className="modalBtn btnTime" variant="danger" onClick={() => {this.setStartingTime(5400);}}>
									1.5hr
								</Button>
							</Col>
							<Col xs="4" className="text-center">
								<Button className="modalBtn btnTime" variant="danger" onClick={() => {this.setStartingTime(7200);}}>
									2hr
								</Button>
							</Col>
						</Row></>}
					</div>
				</Modal.Body>
			</Modal>
		);
	}
}

export default TimeForm;