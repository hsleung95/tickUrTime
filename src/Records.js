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
			var dateRecords = [];
			var activityRecords = [];

			this.props.records.forEach(record => {
				var date = new Date(record.startTime);
				date = formatDate(date);
				if (!dateRecords[date]) {
					dateRecords[date] = [];
				}
				dateRecords[date].push(record);

				if (!activityRecords[record.activity]) {
					activityRecords[record.activity] = 0;
				}
				activityRecords[record.activity] += record.timeSpent;
			});
			this.dateRecords = new DateRecords(dateRecords);
			this.activityRecords = ActivityRecords(activityRecords);
			this.state = {
				records: props.records,
				dateRecords: dateRecords,
				activityRecords: activityRecords,
				type: "activity",
				showForm: false
			};
			this.inputAddRecord = this.inputAddRecord.bind(this);
			this.addRecord = props.addRecord.bind(this);
			this.toggleForm = this.toggleForm.bind(this);
		}
		
		toggleForm(val) {
			this.setState({showForm: val});
			
		}
		
		inputAddRecord() {
			var name = "testInput";
			var startDate = new Date("2022-05-08");
			var endDate = new Date("2022-05-08 23:59:59");
			var timeSpent = (endDate - startDate) / 1000;
			this.addRecord(name, startDate, endDate, timeSpent);
		}
		
		render() {
			return (
				<div className="recordTab">
					<Row className="row-btn">
						<Col>
							<Button className="modalBtn" variant="success" onClick={() => this.toggleForm(true)}>
								Add Record
							</Button>
							<Button className="modalBtn" onClick={() => this.setState({type: "activity"})}>
								Activity
							</Button>
							<Button className="modalBtn" onClick={() => this.setState({type: "date"})}>
								Date
							</Button>
						</Col>
					</Row>

					<RecordForm addRecord={this.addRecord} showForm={this.state.showForm} toggleForm={this.toggleForm} />
					<br />
					{this.state.type == "date" && <><Row className="fw-bold">
							<Col xs="3" className="text-center">
								Date
							</Col>
							<Col xs="6" className="text-center">
								Activity
							</Col>
							<Col xs="3" className="text-center">
								Time Spent
							</Col>
						</Row>
						<div className="records dateRecords">
							{this.dateRecords}
						</div></>}
					{this.state.type == "activity" && <><Row className="fw-bold">
							<Col xs="6" className="text-center">
								Activity
							</Col>
							<Col xs="6" className="text-center">
								Time Spent
							</Col>
						</Row>
						<div className="records activityRecords">
							{this.activityRecords}
						</div></>}
				</div>
			);
		}
}

export default Records;
