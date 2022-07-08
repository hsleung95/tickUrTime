import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {formatSeconds} from './../utils/DateUtils.js';

function DateRecords(props) {
	var records = [];
	for (var key in props) {
		var dateRecords = props[key];
		dateRecords.forEach(record => {
		records.push(
				<Row className="record">
					<Col xs="3" className="text-center">
						{key}
					</Col>
					<Col xs="6" className="text-center">
					{record.activity}
					</Col>
					<Col xs="3" className="text-center">
					{formatSeconds(record.timeSpent)}
					</Col>
				</Row>
			);			
		});
	}
	return (
		<>
		{records}
		</>
	);
}
export default DateRecords;
