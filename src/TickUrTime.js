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
import { withAuth0 } from "@auth0/auth0-react";

class TickUrTime extends React.Component {

	timer;
	commonLength;
	config;

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
		
		this.getFromDB = this.getFromDB.bind(this);
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

	async setToken() {
		const {user, isAuthenticated} = this.props.auth0;
		var localToken = localStorage.getItem("token")
		var token = (isAuthenticated) ? user.sub : localToken;

		if (token == null || token == "null") {
			await axios.get("http://localhost:8080/token")
				.then(res => {
					return res.data.token;
				})
				.then(token => {
					localStorage.setItem("token", token);
					this.config = {headers: {token: token}};
				});
		} else {
			var tokenPrefix = token.substring(0,5);
			var localTokenPrefix = localToken.substring(0,5);
			if (localTokenPrefix == "guest" && tokenPrefix != localTokenPrefix) {
				var params = {oldToken: localToken, newToken: token};
				axios.put("http://localhost:8080/token", params);
			}
			localStorage.setItem("token", token);
			this.config = {headers: {token: token}};
		}
	}
	
	componentDidMount() {
		this.setToken().then(res => {
			this.getFromDB();
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
		this.setState({records: []});
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
	
	getFromDB() {
		axios.get("http://localhost:8080/activityRecords", this.config)
			.then(res => {
				console.log(res.data);
				this.setState({records: res.data});
			}).catch(err => {
				console.log(err);
			});
	}

	addRecord(activityName = null, startTime = null, endTime = null, timeSpent = null) {
		activityName = (activityName == null) ? this.state.activity.name : activityName;
		startTime = (startTime == null) ? this.state.date : startTime;
		endTime = (endTime == null) ? new Date() : endTime;
		var timeSpent = (timeSpent == null) ? this.state.count : timeSpent;
		var record = {
			activity: activityName,
			startTime: startTime.toUTCString(),
			endTime: endTime.toUTCString(),
			timeSpent: timeSpent,
			userId: "",
			description: ""
		};
		axios.post("http://localhost:8080/activityRecords",record, this.config)
		.then(() => {
			this.getFromDB()
		});
	}

	updateRecord(id, activityName, startTime, endTime, timeSpent) {
		var record = {
			activity: activityName,
			startTime: startTime.toUTCString(),
			endTime: endTime.toUTCString(),
			timeSpent: timeSpent,
			description: ""
		};
		axios.put("http://localhost:8080/activityRecords/" + id,record, this.config)
		.then(() => {
			this.getFromDB()
		});
	}
	
	deleteRecord(id) {
		axios.delete("http://localhost:8080/activityRecords/" + id, this.config)
		.then(() => {
			this.getFromDB()
		});
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
						<Records addRecord={this.addRecord} 
								 updateRecord={this.updateRecord} 
								 deleteRecord={this.deleteRecord} 
								 records = {this.state.records} 
								 getFromDB={this.getFromDB} />
					</Tab>
				</Tabs>
			</div>
		);
	}
}

export default withAuth0(TickUrTime);
