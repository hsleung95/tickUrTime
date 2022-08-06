import React from 'react';
import Button from 'react-bootstrap/Button';
import Record from './records/Record.js';
import ActivityRecords from './records/ActivityRecords.js';
import DateRecords from './records/DateRecords.js';
import RecordForm from './RecordForm.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {formatDate} from './utils/DateUtils.js';
import './css/Records.scss';
import Controller from './Controller.js';

class Records extends React.Component {
	
	controller;

	constructor(props) {
		super(props);
		this.state = {
			type: "date",
			showForm: false,
			currentRecord: null,
			selectedDate: new Date()
		};
		this.controller = new Controller();
		this.getRecord = props.getRecord.bind(this);
		this.addRecord = props.addRecord.bind(this);
		this.updateRecord = props.updateRecord.bind(this);
		this.deleteRecord = props.deleteRecord.bind(this);
		this.toggleForm = this.toggleForm.bind(this);
		this.setCurrentRecord = this.setCurrentRecord.bind(this);
		this.updateDate = this.updateDate.bind(this);
	}
	
	toggleForm(val) {
		this.setState({
			currentRecord: null,
			showForm: val
		});
	}
	
	populateActivityRecords() {
		var activityRecords = [];
		this.props.records.forEach(record => {

			if (!activityRecords[record.activity]) {
				activityRecords[record.activity] = 0;
			}
			activityRecords[record.activity] += record.timeSpent;
		});			
		this.setState({activityRecords: activityRecords});
	}
	
	setCurrentRecord(record) {
		this.setState({
			currentRecord: record,
			showForm: true
		});
	}
	
	updateDate(val) {
		this.setState({selectedDate: val});
	}
	
	render() {
		return (
			<div className="recordTab">
				<Row className="row-btn">
					<Col>
						<Button className="modalBtn" variant="success" onClick={() => this.toggleForm(true)}>
							Add Record
						</Button>
						<Button className="modalBtn" onClick={() => this.setState({type: "date"})}>
							Date
						</Button>
						<Button className="modalBtn" onClick={() => this.setState({type: "activity"})}>
							Activity
						</Button>
					</Col>
				</Row>

				<RecordForm addRecord={this.addRecord}
							updateRecord={this.updateRecord}
							deleteRecord={this.deleteRecord}
							showForm={this.state.showForm}
							toggleForm={this.toggleForm}
							getRecord={this.getRecord}
							record={this.state.currentRecord}/>
				<br />
				{this.state.type == "date" && <DateRecords records={this.props.records} setCurrentRecord={this.setCurrentRecord} selectedDate={this.state.selectedDate} updateDate={this.updateDate} />}
				{this.state.type == "activity" && <ActivityRecords records={this.props.records} />}
			</div>
		);
	}
}

export default Records;