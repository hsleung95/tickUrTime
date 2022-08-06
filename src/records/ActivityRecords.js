import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {formatSeconds} from './../utils/DateUtils.js';

function ActivityRecords(props) {
	var records = [];
	var activityRecords = [];
	if (props.records) {
		props.records.forEach(record => {

			if (!activityRecords[record.activity]) {
				activityRecords[record.activity] = 0;
			}
			activityRecords[record.activity] += record.timeSpent;
		});
	}
	for (var key in activityRecords) {
		records.push(
				<Row key={key} className="record">
					<Col xs="6" className="text-center">
						{key}
					</Col>
					<Col xs="6" className="text-center">
						{formatSeconds(activityRecords[key])}
					</Col>
				</Row>

		);
	}
	return (
		<>
			<Row className="fw-bold">
				<Col xs="6" className="text-center">
					Activity
				</Col>
				<Col xs="6" className="text-center">
					Total Time Spent
				</Col>
			</Row>
			<div className="records activityRecords">
				{records}
			</div>
		</>
	);
}
export default ActivityRecords;
