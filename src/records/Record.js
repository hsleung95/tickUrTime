import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Record extends React.Component {
	
	activity;
	startTime;
	endTime;
	timeSpent;
	
	constructor(props) {
		super(props);
		this.activity = props.params.activity;
		this.startTime = new Date(props.params.startTime);
		this.endTime = new Date(props.params.endTime);
		this.timeSpent = props.params.timeSpent;
	}
	
	formatDates() {
		var startDate = this.startTime.getFullYear() + this.startTime.getMonth() + this.startTime.getDate();
		var endDate = this.endTime.getFullYear() + this.endTime.getMonth() + this.endTime.getDate();
		if (endDate > startDate) {
			var startDateStr = this.formatDate(this.startTime) + ' ' + this.formatTime(this.startTime);
			var endDateStr = this.formatDate(this.endTime) + ' ' + this.formatTime(this.endTime);
			return  startDateStr + ' To ' + endDateStr;
		} else {
			var dateStr = this.formatDate(this.startTime);
			return dateStr + ' ' + this.formatTime(this.startTime) + ' To ' + this.formatTime(this.endTime);
		}
	}
	
	formatTime(date) {
		var hr = this.padZero(date.getHours());
		var min = this.padZero(date.getMinutes());
		var second = this.padZero(date.getSeconds());
		return hr + ':' + min + ':' + second;
	}
	
	formatDate(date) {
		var year = date.getFullYear();
		var month = this.padZero(date.getMonth() + 1);
		var day = this.padZero(date.getDate());
		return year + '-' + month + '-' + day;
	}
	
	formatSeconds(seconds) {
		var hr = parseInt(seconds/3600);
		seconds -= (hr*3600);
		hr = (hr > 0) ? (hr + 'hr ') : "";
		var min = parseInt(seconds/60);
		seconds -= (min*60);
		min = (min > 0) ? (min + 'min ') : "";
		return hr + min + (seconds%60) + 'sec'; 
	}
	
	padZero(val) {
		if (val < 10) {
			return '0' + val;
		}
		return val;
	}
	
	render() {
		return (
		<Row className="record">
			<Col xs="3" className="text-center">
				{this.activity}
			</Col>
			<Col xs="6" className="text-center">
				{this.formatDates()}
			</Col>
			<Col xs="3">
				{this.formatSeconds(this.timeSpent)}
			</Col>
		</Row>
		);
	}
}
export default Record;
