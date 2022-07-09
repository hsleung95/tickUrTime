import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {formatDate,formatSeconds} from './../utils/DateUtils.js';
import DatePicker from 'sassy-datepicker';

function DateRecords(props) {
	const { useEffect } = React
	const [curDate, setCurDate] = React.useState(new Date());
	const [rec, setRec] = React.useState(null);
	const [showDatePicker, updateShowDatePicker] = React.useState(false);
	
	const toggleShowDatePicker = React.useCallback(
		(val) => updateShowDatePicker(val),
		[updateShowDatePicker],
	);
	
	const setDate = React.useCallback(
		(val) => setCurDate(val),
		[setCurDate]
	);

	var records = [];
	var dates = [];
	var selectedDate = formatDate(curDate);
	props.records.forEach(record => {
		var date = new Date(record.startTime);
		date = formatDate(date);
		if (!dates[date]) {
			dates[date] = [];
		}
		if (!records[date]) {
			records[date] = [];
		}
		dates[date].push(record);
	});
	var i = 0;
	for (var date in dates) {
		var dateRecords = dates[date];
		dateRecords.forEach(record => {
			records[date].push(
				<Row key={i} className="record" onClick={() => {props.setCurrentRecord(record);}}>
					<Col xs="3" className="text-center">
						{date}
					</Col>
					<Col xs="6" className="text-center">
					{record.activity}
					</Col>
					<Col xs="3" className="text-center">
					{formatSeconds(record.timeSpent)}
					</Col>
				</Row>
			);
			i++;
			});
	}
	
	const changeVal = (val) => {
		setDate(val);
		setRec(records[formatDate(val)]);
		toggleShowDatePicker(false);
	};
	
	const prevDay = () => {
		curDate.setDate(curDate.getDate()-1);
		setDate(new Date(curDate.getTime()));
	}

	return (
		<>
			<Row className="text-center">
				<Col xs="3">
					<div className="btn-change-date" onClick={prevDay}>
						&lt;
					</div>
				</Col>
				<Col xs="6">
					<div className="dateDiv">
						<div onClick={() => {toggleShowDatePicker(true);}}>
							{formatDate(curDate)}
						</div>
						{showDatePicker && <DatePicker id="datepicker" value={curDate} onChange={changeVal} />}
					</div>
				</Col>
				<Col xs="3">
					<div className="btn-change-date">
						&gt;
					</div>
				</Col>
			</Row>
			<br />
			<Row className="fw-bold">
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
				{rec}
			</div>
		</>
	);
}
export default DateRecords;
