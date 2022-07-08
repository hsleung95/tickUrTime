import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

class RecordForm extends React.Component {

    currentDate;
	activity;
	
    constructor(props) {
        super(props);
        var current = new Date();
        this.currentDate = current.toISOString();
		this.activity = props.activity;
        this.handleSubmit = this.handleSubmit.bind(this);
		this.addRecord = props.addRecord.bind(this);
		this.toggleForm = props.toggleForm.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
	var startTime = new Date(e.target.startTime.value);
	var endTime =  new Date(e.target.endTime.value);
	this.addRecord(e.target.activity.value, startTime, endTime, Math.round((endTime-startTime)/1000));
        this.toggleForm(false);
    }

    render() {
        return (
        <>
            <Modal show={this.props.showForm} onHide={() => this.toggleForm(false)}>
                <Modal.Header>
                    New Record
                </Modal.Header>
                <Modal.Body>
                <Form id="eventForm" className="recordForm" onSubmit={this.handleSubmit}>
                    <Row>
                        <Form.Group className="mb-3" controlId="activity">
                            <Form.Label>Activity</Form.Label>
                            <Form.Control type="text" defaultValue={this.activity}/>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3" controlId="startTime">
                            <Form.Label>From</Form.Label>
                            <FormControl type="datetime-local" placeholder="date" defaultValue={this.currentDate}/>                                                     
                            </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3" controlId="endTime">
                            <Form.Label>To</Form.Label>
                            <FormControl type="datetime-local" placeholder="date" defaultValue={this.currentDate}/>                                                     
                            </Form.Group>
                    </Row>
					<Button variant="primary" type="submit">
						Submit
					</Button>
					<Button className="modalBtn class-right" variant="danger" onClick={() => this.toggleForm(false)}>
						Cancel
					</Button>
                </Form>
                </Modal.Body>
            </Modal>
        </>
        );
    }
}

export default RecordForm;

