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

class Records extends React.Component {

		constructor(props) {
			super(props);
			this.state = {
				type: "date",
				showForm: false,
				currentRecord: null
			};
			this.getFromDB = props.getFromDB.bind(this);
			this.addRecord = props.addRecord.bind(this);
			this.updateRecord = props.updateRecord.bind(this);
			this.deleteRecord = props.deleteRecord.bind(this);
			this.toggleForm = this.toggleForm.bind(this);
			this.setCurrentRecord = this.setCurrentRecord.bind(this);
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
								getFromDB={this.getFromDB}
								record={this.state.currentRecord} />
					<br />
					{this.state.type == "date" && <DateRecords records={this.props.records} setCurrentRecord={this.setCurrentRecord} />}
					{this.state.type == "activity" && <ActivityRecords records={this.props.records} />}
				</div>
			);
		}
}

export default Records;