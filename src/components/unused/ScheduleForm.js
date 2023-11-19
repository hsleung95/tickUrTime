import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Weekdays from '../formContent/Weekdays';
import Monthdays from '../formContent/Monthdays';

class ScheduleForm extends React.Component {
    currentDate;
	
    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            frequency: "monthly",
        };
        var duration = props.duration == null ? "0:0" : props.duration;
        var durationArr = duration.split(":");
        this.description = props.description;
        this.durationHr = durationArr[0];
        this.durationMin = durationArr[1];
        this.startDate = props.startDate;
        this.frequency = props.frequency;
        this.weekdays =  Weekdays(props);
        this.months = Monthdays(props);
        
        var current = new Date();
        this.currentDate = current.toISOString();
        this.validateTime = this.validateTime.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    validateTime(e, range) {
        if (e.target.value < 0) {
            e.target.value  = 0;
        }
        if (e.target.value > range) {
            e.target.value = range;
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        var duration = "".concat(e.target.durationHr.value, ":", e.target.durationMin.value);
        // console.log(duration);
        console.log(e.target.startDate.value);
        this.setState({showForm: false});
    }

    render() {
        return (
        <>
            <Row>
                <Col xs="10"></Col>
                <Col>
                    <Button className="modalBtn" variant="success" onClick={() => this.setState({showForm: true})}>
                        +
                    </Button>
                </Col>
            </Row>
            <Modal show={this.state.showForm} onHide={() => this.setState({showForm: false})}>
                <Modal.Header>
                    Schedule
                </Modal.Header>
                <Modal.Body>
                <Form id="eventForm" onSubmit={this.handleSubmit}>
                    <Row>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" defaultValue={this.description}/>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Starts From</Form.Label>
                            <FormControl id="startDate" type="datetime-local" placeholder="date" defaultValue={this.currentDate}/>                                                     
                            </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Duration</Form.Label>
                            <InputGroup>
                                <FormControl id="durationHr" type="number" placeholder="hour" defaultValue={this.durationHr} />
                                <FormControl id="durationMin" placeholder="minute" defaultValue={this.durationMin} />
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Frequency</Form.Label>
                            <InputGroup>
                                <Form.Select id="frequency"
                                 value={this.state.frequency}
                                 onChange={(e)=>{this.setState({frequency: e.target.value})}}>
                                    <option value=""></option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3">
                        {this.state.frequency=="weekly" && this.weekdays}
                        {this.state.frequency=="monthly" && this.months}
                        </Form.Group>
                    </Row>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                </Modal.Body>
            </Modal>
        </>
        );
    }
}

export default ScheduleForm;

