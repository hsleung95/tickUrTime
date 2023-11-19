import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';
import {formatSeconds, formatDateVal} from './../../utils/DateUtils.js';
import {Tagging} from '../Tagging.js';

class RecordForm extends React.Component {
	
    constructor(props) {
        super(props);
		this.state = {
			startTime: null,
			endTime: null,
			timeSpent: null,
			activity: []
		};
		this.getRecords = props.getRecords.bind(this);
		this.addRecord = props.addRecord.bind(this);
		this.updateRecord = props.updateRecord.bind(this);
		this.deleteRecord = props.deleteRecord.bind(this);
		this.toggleForm = props.toggleForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
		this.setStartTime = this.setStartTime.bind(this);
		this.setEndTime = this.setEndTime.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);
		this.setRecordForm = this.setRecordForm.bind(this);
		this.setActivity = this.setActivity.bind(this);
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
			this.addRecord(this.state.activity, e.target.description.value, startDate, endDate, timeSpent);
		} else {
			this.updateRecord(this.props.record.id, this.state.activity, e.target.description.value, startDate, endDate, timeSpent);
		}
        this.toggleForm(false);
    }
	
	setStartTime(e) {
		var startTime =  new Date(e.target.value);
		var timeSpent = (this.state.endTime - startTime) / 1000;
		// console.log("start time: " + startTime + ", end time: " + this.state.endTime); 
		// console.log(timeSpent);
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
		var timeSpent = (endTime - this.state.startTime) / 1000;
		// console.log("start time: " + this.state.startTime + ", end time: " + endTime); 
		// console.log(timeSpent);
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
			activity: (this.props.record) ? this.props.record.activity : []
		});
	}
	
	confirmDelete(e) {
		if (window.confirm("Delete record?") == true) {
			this.deleteRecord(this.props.record.id);
			this.toggleForm(false);
		}
	}

	setActivity(activity) {
		this.setState({
			activity: activity
		});
	}

    render() {
		var activity = (this.props.record) ? this.props.record.activity : [];
		var description = (this.props.record) ? this.props.record.description: '';
		var startDate = (this.props.record) ? formatDateVal(new Date(this.props.record.startTime)) : formatDateVal(new Date());
		var endDate = (this.props.record) ?  formatDateVal(new Date(this.props.record.endTime)) : formatDateVal(new Date());
		var timeSpent = (this.props.record) ? formatSeconds(this.props.record.timeSpent) : 0;
        return (
        <>
            <Modal show={this.props.showForm} onHide={() => this.toggleForm(false)} onShow={this.setRecordForm}>
                <Modal.Header>
                    {(this.props.record == null) ? 'New Record' : 'Update Record'}
                </Modal.Header>
                <Modal.Body>
                <Form id="eventForm" className="recordForm" onSubmit={this.handleSubmit} noValidate>
					<Row>
					</Row>
                    <Row>
                        <Form.Group className="mb-3" controlId="activity">
                            <Form.Label>Activity</Form.Label>
							<Tagging
								tags={activity}
								setTags={this.setActivity}
								name={"activity"}
							/>
                        </Form.Group>
                    </Row>
					<Row>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" defaultValue={description} />
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

