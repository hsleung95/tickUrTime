import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ActivityRecords from './records/ActivityRecords.js';
import DateRecords from './records/DateRecords.js';
import RecordForm from './records/RecordForm.js';
import ActivityRecordsModal from './records/ActivityRecordsModal.js';
import './../css/Records.scss';

const ACTIVITY = "activity";
const DATE = "date";
class Records extends React.Component {
	
	controller;

	constructor(props) {
		super(props);
		this.state = {
			type: ACTIVITY,
			showForm: false,
			showActivityRecords: false,
			currentRecord: null
		};
		this.getRecords = props.getRecords.bind(this);
		this.getActivityRecords = props.getActivityRecords.bind(this);
		this.getRecordsSummary = props.getRecordsSummary.bind(this);
		this.addRecord = props.addRecord.bind(this);
		this.updateRecord = props.updateRecord.bind(this);
		this.deleteRecord = props.deleteRecord.bind(this);
		this.updateDate = props.updateDate.bind(this);
		this.updateStartDate = props.updateStartDate.bind(this);
		this.updateEndDate = this.props.updateEndDate.bind(this);

		this.toggleForm = this.toggleForm.bind(this);
		this.toggleActivityRecordsModal = this.toggleActivityRecordsModal.bind(this);
		this.setActivityRecords = this.setActivityRecords.bind(this);
		this.setCurrentRecord = this.setCurrentRecord.bind(this);
	}
	
	toggleForm(val) {
		this.setState({
			currentRecord: null,
			showForm: val
		});
	}
	
	setCurrentRecord(record) {
		this.setState({
			currentRecord: record,
			showForm: true
		});
	}

	toggleActivityRecordsModal(val) {
		this.setState({
			showActivityRecords: val
		});
	}

	setActivityRecords(activity, startDate, endDate) {
		this.getActivityRecords(activity, startDate, endDate);
		this.toggleActivityRecordsModal(true);
	}
	
	render() {
		return (
			<div className="recordTab tab">
				<Row className="row-btn">
					<Col>
						<Button className="modalBtn" variant="success" onClick={() => this.toggleForm(true)}>
							Add Record
						</Button>
						<Button className="modalBtn" onClick={() => this.setState({type: DATE})}>
							Date
						</Button>
						<Button className="modalBtn" onClick={() => this.setState({type: ACTIVITY})}>
							Activity
						</Button>
					</Col>
				</Row>

				<RecordForm addRecord={this.addRecord}
							updateRecord={this.updateRecord}
							deleteRecord={this.deleteRecord}
							showForm={this.state.showForm}
							toggleForm={this.toggleForm}
							getRecords={this.getRecords}
							record={this.state.currentRecord}/>
				<ActivityRecordsModal 	showActivityRecords={this.state.showActivityRecords}
										activityRecords={this.props.activityRecords}
										activity={this.props.modalActivity}
										setCurrentRecord={this.setCurrentRecord}
										toggleActivityRecordsModal={this.toggleActivityRecordsModal}
				/>
				<br />
				{this.state.type == "date" && 
				<DateRecords records={this.props.records}
							setCurrentRecord={this.setCurrentRecord}
							selectedDate={this.props.selectedDate}
							updateDate={this.updateDate} 
							getRecords={this.getRecords}
							/>}
				{this.state.type == "activity" && 
				<ActivityRecords records={this.props.recordsSummary} 
								startDate={this.props.startDate}
								endDate={this.props.endDate}
								updateStartDate={this.updateStartDate}
								updateEndDate={this.updateEndDate}
								setActivityRecords={this.setActivityRecords}
								/>}
			</div>
		);
	}
}

export default Records;