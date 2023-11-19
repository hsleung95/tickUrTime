import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {formatSeconds,formatDate} from '../../utils/DateUtils.js';
import {ClickOutsideDatePicker} from '../ClickOutsideDatePicker.js';

function ActivityRecords(props) {


	const [showStartDatePicker, updateShowStartDatePicker] = React.useState(false);
	const toggleShowStartDatePicker = React.useCallback(
		(val) => updateShowStartDatePicker(val),
		[updateShowStartDatePicker],
	);
	const changeStartDate = (val) => {
		props.updateStartDate(val);
		toggleShowStartDatePicker(false);
		toggleShowEndDatePicker(true);
	};

	const [showEndDatePicker, updateShowEndDatePicker] = React.useState(false);
	const toggleShowEndDatePicker = React.useCallback(
		(val) => updateShowEndDatePicker(val),
		[updateShowEndDatePicker],
	);
	const changeEndDate = (val) => {
		props.updateEndDate(val);
		toggleShowEndDatePicker(false);
	};

	var records = [];
	if (props.records) {
		for (var key in props.records) {
			records.push(
					<Row key={key} data-key={key} className="record" onClick={(e) => {;props.setActivityRecords(e.currentTarget.dataset.key, props.startDate, props.endDate)}}>
						<Col xs="4" className="text-center">
							{key}
						</Col>
						<Col xs="2" className="text-center">
							{props.records[key].days}
						</Col>
						<Col xs="2" className="text-center">
							{formatSeconds(props.records[key].total)}
						</Col>
						<Col xs="2" className="text-center">
							{formatSeconds(props.records[key].average)}
						</Col>
						<Col xs="2" className="text-center">
							{formatSeconds(props.records[key].participatedAverage)}
						</Col>
					</Row>
			);
		}
	}

	return (
		<div className="activityRecords">
			<Row>
				<Col xs="5">
					<Button className="dateDiv activityDateDiv text-center fw-bold" onClick={() => {!showStartDatePicker && toggleShowStartDatePicker(true);}}>
						{formatDate(props.startDate)}
					</Button>
					<ClickOutsideDatePicker show={showStartDatePicker} onClickOutside={() => {updateShowStartDatePicker(false)}} date={props.startDate} changeDate={changeStartDate} />
				</Col>
				<Col xs="2">
					<div className="dateDiv text-center fw-bold">
						to
					</div>
				</Col>
				<Col xs="5">
					<Button className="dateDiv activityDateDiv text-center fw-bold" onClick={() => {!showEndDatePicker && toggleShowEndDatePicker(true);}}>
						{formatDate(props.endDate)}
					</Button>
					<ClickOutsideDatePicker show={showEndDatePicker} onClickOutside={() => {updateShowEndDatePicker(false)}} date={props.endDate} changeDate={changeEndDate} />
				</Col>
			</Row>
			<br />
			<Row className="fw-bold record-fields">
				<Col xs="4" className="text-center">
					Activity
				</Col>
				<Col xs="2" className="text-center">
					Total Days
				</Col>
				<Col xs="2" className="text-center">
					Total Time Spent
				</Col>
				<Col xs="2" className="text-center">
					Average Time Spent
				</Col>
				<Col xs="2" className="text-center">
					Average Time Spent Per days
				</Col>
			</Row>
			<div className="records activityRecords">
				{records}
			</div>
		</div>
	);
}
export default ActivityRecords;
