import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tabs';
import Records from './components/Records.js';
import Timing from './components/Timing.js';
import './css/TickUrTime.scss';
import './css/timing/Clock.scss';
import './css/timing/Timer.scss';
import LoginButton from './components/auth/LoginButton.js';
import LogoutButton from './components/auth/LogoutButton.js';
import { withAuth0 } from "@auth0/auth0-react";
import Controller from './Controller.js';
import { Card } from 'react-bootstrap';

const END_OF_MONTHS = [31,30,31,30,31,30,31,31,30,31,30,31];

class TickUrTime extends React.Component {

	commonLength;
	controller;

	constructor(props) {
		super(props);
		var activities = [];
		var commonlyUsed = [];
		this.commonLength = 3;
		var currentStartDate = new Date();
		currentStartDate.setDate(1);
		var currentEndDate = new Date();
		currentEndDate.setDate(END_OF_MONTHS[currentEndDate.getMonth()]);
		
		this.state = {
			activity: null,
			activities: activities,
			commonlyUsed: commonlyUsed,
			estimatedTime: null,
			notified: false,
			records: [],
			activityRecords: [],
			recordsSummary: [],
			startDate: currentStartDate,
			endDate: currentEndDate,
			selectedDate: new Date(),
			modalActivity: ''
		};

		
		this.controller = new Controller();
		this.addRecord = this.addRecord.bind(this);
		this.getRecords = this.getRecords.bind(this);
		this.updateRecord = this.updateRecord.bind(this);
		this.deleteRecord = this.deleteRecord.bind(this);
		this.getActivityRecords = this.getActivityRecords.bind(this);
		this.getRecordsSummary = this.getRecordsSummary.bind(this);
		this.getActivities = this.getActivities.bind(this);
		this.addActivity = this.addActivity.bind(this);
		this.setActivity = this.setActivity.bind(this);
		this.setToken = this.setToken.bind(this);
		this.updateDate = this.updateDate.bind(this);
		this.updateStartDate = this.updateStartDate.bind(this);
		this.updateEndDate = this.updateEndDate.bind(this);
		window.globalConfig = null;
	}
	
	setCommonlyUsed() {
		var commonlyUsed = [];
		this.state.activities.forEach((activity, i) => {
			if(true == activity.commonlyUsed && commonlyUsed.length < this.commonLength) {
				commonlyUsed.push(activity);
			}
		});
		this.setState({commonlyUsed: commonlyUsed});
	}

	async setToken() {
		const {user, isAuthenticated} = this.props.auth0;
		var localToken = localStorage.getItem("token");
		var token = (isAuthenticated) ? user.sub : localToken;

		if (token == null || token == "null") {
			await this.getToken();
		} else {
			var tokenPrefix = token.substring(0,5);
			var localTokenPrefix = localToken.substring(0,5);
			if (localTokenPrefix != "guest" && localTokenPrefix != "auth0") {
				await this.getToken();
			} else if (localTokenPrefix == "guest" && tokenPrefix != localTokenPrefix) {
				await this.controller.putToken(localToken, token);
				localStorage.setItem("token", token);
				window.globalConfig = {headers: {token: token}};
			} else {
				window.globalConfig = {headers: {token: token}};
			}
		}
	}

	async getToken() {
		var requestToken = await this.controller.getToken();
		if (requestToken != null) {
			localStorage.setItem("token", requestToken);
			window.globalConfig = {headers: {token: requestToken}};
		}
}
	
	componentDidMount() {
		this.askNotificationPermission();
		this.setToken().then(res => {
			this.getRecords(null, this.state.startDate, this.state.endDate);
			this.getRecordsSummary(this.state.startDate, this.state.endDate);
			this.getActivities();
		});
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
	
	async getActivities() {
		await this.setToken();
		// var activities = await this.controller.getActivities();
		// this.setState({activities: (activities == null) ? [] : activities});
		// this.setCommonlyUsed();
	}
	
	async addActivity(activityInput) {
		var activity = {
			name: activityInput,
			commonlyUsed: false,
			userId: window.globalConfig.headers.token
		};
		await this.controller.addActivity(activity);
		this.getActivities();
	}
	
	setActivity(val) {
		this.setState({
			activity: val
		});
	}
	
	
	async askNotificationPermission() {
		if (Notification.permission !== 'denied') {
			await Notification.requestPermission();
		}
	}
	
	async getRecords(activity = null, startTime = null, endTime = null) {
		await this.setToken();
		var records = await this.controller.getRecords(activity,startTime, endTime);
		this.setState({
			records: records
		});
	}

	async getActivityRecords(activity = null, startTime = null, endTime = null) {
		await this.setToken();
		this.setState({activityRecords: []});
		var records = await this.controller.getRecords(activity,startTime, endTime);
		this.setState({
			activityRecords: records,
			modalActivity: activity
		});
	}

	async getRecordsSummary(startTime = null, endTime = null) {
		await this.setToken();
		var records = await this.controller.getRecordsSummary(startTime, endTime);
		this.setState({
			recordsSummary: records
		});
	}

	async addRecord(activity, description, startTime, endTime, timeSpent) {
		var record = {
			activity: activity,
			startTime: (startTime == null) ? "" : startTime.toUTCString(),
			endTime: (endTime == null) ? "" :  endTime.toUTCString(),
			timeSpent: timeSpent,
			userId: window.globalConfig.headers.token,
			description: description
		};
		await this.controller.addActivityRecord(record);
		this.getActivityRecords(this.state.modalActivity, this.state.startDate, this.state.endDate);
		this.getRecords(null, this.state.startDate, this.state.endDate);
		this.getRecordsSummary(this.state.startDate, this.state.endDate);
}

	async updateRecord(id, activity, description, startTime, endTime, timeSpent) {
		var record = {
			activity: activity,
			startTime: startTime.toUTCString(),
			endTime: endTime.toUTCString(),
			timeSpent: timeSpent,
			userId: window.globalConfig.headers.token,
			description: description
		};
		 await this.controller.updateActivityRecord(id, record);
		 this.getActivityRecords(this.state.modalActivity, this.state.startDate, this.state.endDate);
		 this.getRecords(null, this.state.startDate, this.state.endDate);
		 this.getRecordsSummary(this.state.startDate, this.state.endDate);
 }
	
	async deleteRecord(id) {
		await this.controller.deleteActivityRecord(id);
		this.getActivityRecords(this.state.modalActivity, this.state.startDate, this.state.endDate);
		this.getRecords(null, this.state.startDate, this.state.endDate);
		this.getRecordsSummary(this.state.startDate, this.state.endDate);
  }

		
	updateDate(val) {
		if (val.getTime() < this.state.startDate.getTime()) {
			this.getRecords(null, val, this.state.endDate);
		} else if (val.getTime() > this.state.endDate.getTime()) {
			this.getRecords(null, this.state.startDate, val);
		}
		this.setState({
			selectedDate: val
		});
	}
	
	updateStartDate(val) {
		if (val.getTime() < this.state.endDate.getTime()) {
			this.getRecordsSummary(val, this.state.endDate);
		}
		this.setState({startDate: val});
	}
	
	updateEndDate(val) {
		if (val.getTime() > this.state.startDate.getTime()) {
			this.getRecordsSummary(this.state.startDate, val);
		}
		this.setState({endDate: val});
	}

	render() {
		const { isAuthenticated } = this.props.auth0;

		return (
			<div className="tickUrTime">
				<Tabs defaultActiveKey="timing" justify>
					<Tab eventKey = "timing" title="timing">
						<Card.Body>
							<Timing 
								addRecord={this.addRecord}
								commonlyUsed={this.state.commonlyUsed}
								activities={this.state.activities}
							/>
						</Card.Body>
					</Tab>
					<Tab eventKey = "records" title="records">
						<Card.Body>
							<Records 
								records = {this.state.records}
								activityRecords = {this.state.activityRecords}
								recordsSummary = {this.state.recordsSummary}
								selectedDate={this.state.selectedDate}
								startDate={this.state.startDate}
								endDate={this.state.endDate}
								modalActivity={this.state.modalActivity}

								addRecord={this.addRecord} 
								updateRecord={this.updateRecord}
								deleteRecord={this.deleteRecord}
								getRecords={this.getRecords}
								getActivityRecords={this.getActivityRecords}
								getRecordsSummary={this.getRecordsSummary}
								updateDate={this.updateDate}
								updateStartDate={this.updateStartDate}
								updateEndDate={this.updateEndDate}
							/>
						 </Card.Body>
					</Tab>
					<Tab eventKey = "userInfo" title="info">
						<Card.Body>
							{isAuthenticated == true && <LogoutButton />}
							{isAuthenticated != true && <LoginButton />}
						</Card.Body>
					</Tab>
				</Tabs>
			</div>
		);
	}
}

export default withAuth0(TickUrTime);
