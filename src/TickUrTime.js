import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tabs';
import Clock from './timing/Clock.js';
import Timer from './timing/Timer.js';
import Records from './Records.js';
import Actions from './Actions.js';
import ActivityList from './ActivityList.js';
import axios from "axios";
import './css/TickUrTime.scss';
import './css/timing/Clock.scss';
import './css/timing/Timer.scss';

class TickUrTime extends React.Component {

	timer;
	commonLength;

	constructor(props) {
		super(props);
		var activities = this.getFromStorage('activities');
		var commonlyUsed = [];
		this.commonLength = 3;
		activities.forEach(activity => {
			if(true == activity.commonlyUsed && commonlyUsed.length < this.commonLength) {
				commonlyUsed.push(activity);
			}
		});
		
		this.state = {
			count: 0,
			counted: 0,
			counting: false,
			activity: null,
			date: new Date(),
			records: this.getFromStorage('records'),
			activities: activities,
			commonlyUsed: commonlyUsed,
			timer: 'timer',
			showActivityList: false
		};
		
		this.getFromDB();
		this.toggleActivityList = this.toggleActivityList.bind(this);
		this.addActivity = this.addActivity.bind(this);
		this.setActivity = this.setActivity.bind(this);
		this.startCounting = this.startCounting.bind(this);
		this.pauseCounting = this.pauseCounting.bind(this);
		this.stopCounting = this.stopCounting.bind(this);
		this.setTimer = this.setTimer.bind(this);
	}
	
	toggleActivityList() {
		this.setState({
			showActivityList: !this.state.showActivityList
		});
	}
	
	getFromDB() {
		var records = axios.get("http://localhost:8080/");
		console.log(records);
	}
	
	getFromStorage(type) {
		var items = localStorage.getItem(type);
		if (items != null) {
			return JSON.parse(items);
		} else {
			var res = [];
			localStorage.setItem(type,JSON.stringify(res));
			return res;
		}		
	}
	
	addActivity(activityInput) {
		var activity = {
			name: activityInput,
			commonlyUsed: (this.state.commonlyUsed.length < this.commonLength)
		};
		var activities = this.state.activities;
		activities.push(activity);
		this.setState({
			toggleInput: false,
			activities: activities
		});
		localStorage.setItem('activities',JSON.stringify(activities));
	}
	
	setActivity(val) {
		this.setState({
			activity: val
		});
	}
	
	startCounting() {
		if (!this.state.counting) {
			this.setState({
				date: new Date()
			});
		}
		
		this.timer = setInterval(() => {
			var date = new Date();
			var newCount = Math.round((date - this.state.date) / 1000);
			this.setState({
				count: newCount,
				counted: 0,
				counting: true
			});
		},1000);
	}
	
	pauseCounting() {
		clearInterval(this.timer);
		this.setState({
			counting: false
		});
	}
	
	stopCounting() {
		clearInterval(this.timer);
		this.addRecord();
		this.setState({
			count: 0,
			counted: this.state.count,
			counting: false,
			date: null
		});
	}
	
	addRecord(activityName = null, startTime = null, endTime = null, timeSpent = null) {
		activityName = (activityName == null) ? this.state.activity.name : activityName;
		startTime = (startTime == null) ? this.state.date : startTime;
		endTime = (endTime == null) ? new Date() : endTime;
		var timeSpent = (timeSpent == null) ? this.state.count : timeSpent;
		var record = {
			id: this.state.records.length,
			activity: activityName,
			startTime: startTime.toUTCString(),
			endTime: endTime.toUTCString(),
			timeSpent: timeSpent,
			description: ""
		};
		var items = this.state.records;
		items.push(record);
		this.setState({
			records: items
		});
		localStorage.setItem('records',JSON.stringify(items));
	}
	
	setTimer() {
		this.setState({'timer': (this.state.timer == 'timer') ? 'clock' : 'timer'});
	}
	
	render() {
		return (
			<div className="tickUrTime">
				<Tabs defaultActiveKey="timing">
					<Tab eventKey = "timing" title="timing">
						<br />
						<div>
							<Row className="rowActivity">
								<Col xs="9">
									{<div className="activities">{this.state.commonlyUsed.map((activity,index) => (
										<Button className="btnActivity" key={index} disabled={this.state.activity==activity} onClick={() => {this.setActivity(activity);}}>
											{activity.name}
										</Button>
									))}</div>}
								</Col>
								<Col xs="3">
									{<Button className="btnMore" onClick={this.toggleActivityList}>
										more
									</Button>}
								</Col>
							</Row>
							<br />
							<Actions setTimer={this.setTimer}
								startCounting={this.startCounting}
								pauseCounting={this.pauseCounting}
								stopCounting={this.stopCounting}
								timer={this.state.timer}
								activity={this.state.activity}
								counting={this.state.counting}
								count={this.state.count}
							/>
							{this.state.timer == 'clock' && <Clock count={this.state.count} />}
							{this.state.timer == 'timer' && <Timer count={this.state.count} />}
							<br />
							<ActivityList showActivityList={this.state.showActivityList}
								setActivity={this.setActivity}
								addActivity={this.addActivity}
								activities={this.state.activities}
								toggleActivityList={this.toggleActivityList}
							/>
						</div>
					</Tab>
					<Tab eventKey = "records" title="records">
						<br />
						<Records addRecord = {this.addRecord} records = {this.state.records} />
					</Tab>
				</Tabs>
			</div>
		);
	}
}

export default TickUrTime;
