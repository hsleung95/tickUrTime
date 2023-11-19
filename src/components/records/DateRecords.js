import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {formatDate,formatTime,formatSeconds} from '../../utils/DateUtils.js';
import {ClickOutsideDatePicker} from '../ClickOutsideDatePicker.js';

function DateRecords(props) {
	var records = [];

	var selectedDate = formatDate(props.selectedDate);
	const [rec, setRec] = React.useState(records[selectedDate]);
	const [showDatePicker, updateShowDatePicker] = React.useState(false);
	
	const toggleShowDatePicker = React.useCallback(
		(val) => updateShowDatePicker(val),
		[updateShowDatePicker],
	);

	if (props.records) {
		for (var date in props.records) {
			var dateRecords = props.records[date];
			if (!records[date]) {
				records[date] = [];
			}
			var i = 0;
			dateRecords.forEach(record => {
				records[date].push(
					<Row key={i} className="record" onClick={() => {props.setCurrentRecord(record);}}>
						<Col xs="3" className="text-center">
							{formatTime(new Date(record.startTime))}-{formatTime(new Date(record.endTime))}
						</Col>
						<Col xs="6" className="text-center">
						{record.activity.join(',')}
						</Col>
						<Col xs="3" className="text-center">
						{formatSeconds(record.timeSpent)}
						</Col>
					</Row>
				);
				i++;
			});
		}
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
		<div className="dateRecords">
			<Row className="text-center">
				<Col xs="3">
					<div className="btn-change-date" onClick={prevDay}>
						<Button>&lt;</Button>
					</div>
				</Col>
				<Col xs="6" onClick={() => {!showDatePicker && toggleShowDatePicker(true);}}>
					<Button className="dateDiv fw-bold">
						{formatDate(props.selectedDate)}
					</Button>
					<ClickOutsideDatePicker show={showDatePicker} onClickOutside={() => {updateShowDatePicker(false)}} date={props.selectedDate} changeDate={changeVal} />
				</Col>
				<Col xs="3">
					<div className="btn-change-date" onClick={nextDay}>
						<Button>&gt;</Button>
					</div>
				</Col>
			</Row>
			<br />
			<Row className="fw-bold record-fields">
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
		</div>
	);
}

export default DateRecords;
