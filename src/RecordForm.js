import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {formatDate, formatTime, formatSeconds, formatDateVal} from './utils/DateUtils.js';
import Controller from './Controller.js';

class RecordForm extends React.Component {
	
	controller;
	
    constructor(props) {
        super(props);
		this.state = {
			startTime: null,
			endTime: null,
			timeSpent: null
		};
		this.controller = new Controller();
        this.handleSubmit = this.handleSubmit.bind(this);
		this.getRecord = props.getRecord.bind(this);
		this.addRecord = props.addRecord.bind(this);
		this.updateRecord = props.updateRecord.bind(this);
		this.deleteRecord = props.deleteRecord.bind(this);
		this.toggleForm = props.toggleForm.bind(this);
		this.setStartTime = this.setStartTime.bind(this);
		this.setEndTime = this.setEndTime.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);
		this.setRecordForm = this.setRecordForm.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
		var startDate = new Date(e.target.startDate.value);
		var endDate = new Date(e.target.endDate.value);
		var timeSpent = (endDate - startDate)/1000;
		if (timeSpent < 0) {
			alert("time incorrect!");
			return;
		}
		if (this.props.record == null) {
			this.addRecord(e.target.activity.value, startDate, endDate, timeSpent);
		} else {
			this.updateRecord(this.props.record._id, e.target.activity.value, startDate, endDate, timeSpent);
		}
        this.toggleForm(false);
    }
	
	setStartTime(e) {
		var startTime =  new Date(e.target.value);
		var timeSpent = -1;
		var timeSpent = (this.state.endTime - startTime) / 1000;
		console.log("start time: " + startTime + ", end time: " + this.state.endTime); 
		console.log(timeSpent);
		if (timeSpent > 0) {
			this.setState({
				startTime: startTime,
				timeSpent: formatSeconds(timeSpent)
			});
		} else {
			this.setState({
				startTime: startTime
			});
		}
	}
	
	setEndTime(e) {
		var endTime =  new Date(e.target.value);
		var timeSpent = -1;
		var timeSpent = (endTime - this.state.startTime) / 1000;
		console.log("start time: " + this.state.startTime + ", end time: " + endTime); 
		console.log(timeSpent);
		if (timeSpent > 0) {
			this.setState({
				endTime: endTime,
				timeSpent: formatSeconds(timeSpent)
			});
		} else {
			this.setState({
				endTime: endTime,
			});
		}
	}
	
	setRecordForm() {
		this.setState({
			startTime: (this.props.record) ? new Date(this.props.record.startTime) : new Date(),
			endTime: (this.props.record) ? new Date(this.props.record.endTime) : new Date(),
		});
	}
	
	confirmDelete(e) {
		if (window.confirm("Delete record?") == true) {
			this.deleteRecord(this.props.record._id);
			this.toggleForm(false);
		}
	}

    render() {
		var startDate = (this.props.record) ? formatDateVal(new Date(this.props.record.startTime)) : formatDateVal(new Date());
		var endDate = (this.props.record) ?  formatDateVal(new Date(this.props.record.endTime)) : formatDateVal(new Date());
		var activity = (this.props.record) ? this.props.record.activity : '';
		var timeSpent = (this.props.record) ? formatSeconds(this.props.record.timeSpent) : 0;
        return (
        <>
            <Modal show={this.props.showForm} onHide={() => this.toggleForm(false)} onShow={this.setRecordForm}>
                <Modal.Header>
                    New Record
                </Modal.Header>
                <Modal.Body>
                <Form id="eventForm" className="recordForm" onSubmit={this.handleSubmit} noValidate>
                    <Row>
                        <Form.Group className="mb-3" controlId="activity">
                            <Form.Label>Activity</Form.Label>
                            <Form.Control type="text" defaultValue={activity}/>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>From</Form.Label>
                            <FormControl id="startDate" type="datetime-local" placeholder="date" defaultValue={startDate} onChange={this.setStartTime}/>                                                     
                            </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>To</Form.Label>
                            <FormControl id="endDate" type="datetime-local" placeholder="date" defaultValue={endDate} onChange={this.setEndTime}/>                                                     
                            </Form.Group>
                    </Row>
                    <Row>			
                        <Form.Group className="mb-3" controlId="timeSpent">
                            <Form.Label>Time Spent</Form.Label>
                            <Form.Control type="text" value={(this.state.timeSpent == null) ? timeSpent : this.state.timeSpent} readOnly />
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                    </Row>
					<Button className="modalBtn" variant="primary" onClick={() => this.toggleForm(false)}>
						Cancel
					</Button>
					{this.props.record != null && 
					<Button className="modalBtn" variant="danger" onClick={this.confirmDelete}>
						Delete
					</Button>}
					<Button className="modalBtn class-right" variant="success" type="submit">
						Submit
					</Button>
                </Form>
                </Modal.Body>
            </Modal>
        </>
        );
    }
}

export default RecordForm;

