import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {formatSeconds} from './../utils/DateUtils.js';

function ActivityRecords(props) {
	var records = [];
	for (var key in props) {
		records.push(
				<Row className="record">
					<Col xs="6" className="text-center">
						{key}
					</Col>
					<Col xs="6" className="text-center">
						{formatSeconds(props[key])}
					</Col>
				</Row>

		);
	}
	return (
		<>
		{records}
		</>
	);
}
export default ActivityRecords;
