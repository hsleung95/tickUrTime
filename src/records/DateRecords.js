import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {formatDate,formatSeconds} from './../utils/DateUtils.js';
import DatePicker from 'sassy-datepicker';

function DateRecords(props) {
	var records = [];
	var dates = [];

	var selectedDate = formatDate(props.selectedDate);
	const [rec, setRec] = React.useState(records[selectedDate]);
	const [showDatePicker, updateShowDatePicker] = React.useState(false);
	
	const toggleShowDatePicker = React.useCallback(
		(val) => updateShowDatePicker(val),
		[updateShowDatePicker],
	);

	if (props.records) {
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
	}
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
		props.updateDate(val);
		setRec(records[formatDate(val)]);
		toggleShowDatePicker(false);
	};
	
	const prevDay = () => {
		props.selectedDate.setDate(props.selectedDate.getDate()-1);
		changeVal(new Date(props.selectedDate.getTime()));
	}
	
	const nextDay = () => {
		props.selectedDate.setDate(props.selectedDate.getDate()+1);
		changeVal(new Date(props.selectedDate.getTime()));
	}
	
	React.useEffect(() => {
		setRec(records[selectedDate]);
	}, [props.records]);

	return (
		<>
			<Row className="text-center">
				<Col xs="3">
					<div className="btn-change-date" onClick={prevDay}>
						<Button>&lt;</Button>
					</div>
				</Col>
				<Col xs="6">
					<div className="dateDiv">
						<div onClick={() => {toggleShowDatePicker(true);}}>
							{formatDate(props.selectedDate)}
						</div>
						{showDatePicker && <DatePicker id="datepicker" value={props.selectedDate} onChange={changeVal} />}
					</div>
				</Col>
				<Col xs="3">
					<div className="btn-change-date" onClick={nextDay}>
						<Button>&gt;</Button>
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
