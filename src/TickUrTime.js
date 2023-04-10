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
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import './css/TickUrTime.scss';
import './css/timing/Clock.scss';
import './css/timing/Timer.scss';
import LoginButton from './auth/LoginButton.js';
import LogoutButton from './auth/LogoutButton.js';
import { withAuth0 } from "@auth0/auth0-react";
import {formatDateVal} from './utils/DateUtils.js';
import Controller from './Controller.js';
import { Card } from "react-bootstrap";
import { Dropdown } from 'react-bootstrap';

class TickUrTime extends React.Component {

	timer;
	commonLength;
	controller;

	constructor(props) {
		super(props);
		var activities = [];
		var commonlyUsed = [];
		this.commonLength = 3;
		
		this.state = {
			count: 0,
			counted: 0,
			counting: false,
			activity: null,
			date: new Date(),
			records: [],
			activities: activities,
			commonlyUsed: commonlyUsed,
			timer: 'timer',
			showActivityList: false,
			estimatedTime: null,
			notified: false
		};
		
		this.controller = new Controller();
		this.getRecord = this.getRecord.bind(this);

		this.toggleActivityList = this.toggleActivityList.bind(this);
		this.getActivities = this.getActivities.bind(this);
		this.addActivity = this.addActivity.bind(this);
		this.setActivity = this.setActivity.bind(this);

		this.startCounting = this.startCounting.bind(this);
		this.pauseCounting = this.pauseCounting.bind(this);
		this.stopCounting = this.stopCounting.bind(this);
		this.setTimer = this.setTimer.bind(this);
		this.updateEstimatedTime = this.updateEstimatedTime.bind(this);
		window.globalConfig = null;
		
	}
	
	toggleActivityList() {
		this.setState({
			showActivityList: !this.state.showActivityList
		});
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
			this.getRecord();
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
		var res = await this.setToken();
		var activities = await this.controller.getActivities();
		this.setState({activities: (activities == null) ? [] : activities});
		this.setCommonlyUsed();

	}
	
	async addActivity(activityInput) {
		var activity = {
			name: activityInput,
			commonlyUsed: false,
			userId: window.globalConfig.headers.token
		};
		var records = await this.controller.addActivity(activity);
		this.getActivities();
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
			if (!this.state.notified && this.state.estimatedTime != null && date.getTime() >= this.state.estimatedTime.getTime()) {
				this.setState({notified: true});
				this.notifyUser();
			}
		},1000);
	}
	
	async askNotificationPermission() {
		let granted = false;

		if (Notification.permission === 'granted') {
			granted = true;
		} else if (Notification.permission !== 'denied') {
			let permission = await Notification.requestPermission();
			granted = permission === 'granted' ? true : false;
		}
	}
	
	notifyUser() {
		if (Notification.permission === 'granted') {
			const noti = new Notification('TickUrTime', {
				body: 'your counting reached your estimated time'
			});
			
			setTimeout(() => {
				noti.close();
			}, 10000);
		}
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
	
	async getRecord() {
		var res = await this.setToken();
		var records = await this.controller.getActivityRecord();
		this.setState({records: (records == null) ? [] : records});
	}

	async addRecord(activityName = null, startTime = null, endTime = null, timeSpent = null) {
		activityName = (activityName == null) ? this.state.activity.name : activityName;
		startTime = (startTime == null) ? this.state.date : startTime;
		endTime = (endTime == null) ? new Date() : endTime;
		var timeSpent = (timeSpent == null) ? this.state.count : timeSpent;
		var record = {
			activity: activityName,
			startTime: startTime.toUTCString(),
			endTime: endTime.toUTCString(),
			timeSpent: timeSpent,
			userId: window.globalConfig.headers.token,
			description: ""
		};
		var records = await this.controller.addActivityRecord(record);
		this.getRecord();
	}

	async updateRecord(id, activityName, startTime, endTime, timeSpent) {
		var record = {
			activity: activityName,
			startTime: startTime.toUTCString(),
			endTime: endTime.toUTCString(),
			timeSpent: timeSpent,
			userId: window.globalConfig.headers.token,
			description: ""
		};
		var records = await this.controller.updateActivityRecord(id, record);
		this.getRecord();
	}
	
	async deleteRecord(id) {
		var records = await this.controller.deleteActivityRecord(id);
		this.getRecord();
	}


	setTimer() {
		this.setState({'timer': (this.state.timer == 'timer') ? 'clock' : 'timer'});
	}
	
	updateEstimatedTime(e) {
		this.setState({
			estimatedTime: new Date(e.target.value)
		});
	}
	
	render() {
		const { isAuthenticated } = this.props.auth0;

		return (
			<div className="tickUrTime">
				<Tabs defaultActiveKey="timing" justify>
					<Card eventKey = "timing" title="timing">
						<Card.Body>
							<Row className="rowActivity">
								<Col xs="9">
									<div className="activities">
										<Dropdown>
											<Dropdown.Toggle variant="success">
												Open Menu
											</Dropdown.Toggle>
										<Dropdown.Menu>
										{this.state.commonlyUsed.map((activity,index) => (
											<Dropdown.Item className="btnActivity" style={{backgroundColor:"#738FA7", border:"none"}} key={index} disabled={this.state.activity==activity} onClick={() => {this.setActivity(activity);}}>
												{activity.name}
											</Dropdown.Item>
										))}
										</Dropdown.Menu>
									</Dropdown>
									</div>
								</Col>
								<Col xs="3">
									{<Button className="btnMore" variant="dark" onClick={this.toggleActivityList}>
										More
									</Button>}
								</Col>
							</Row>
							{this.state.timer == 'clock' && <Clock count={this.state.count} />}
							{this.state.timer == 'timer' && <Timer count={this.state.count} />}
							<Row>
								<Col xs="6" className="text-center" style={{color: "white"}}>Selected Activity:</Col>
								<Col xs="6" className="text-center" style={{color: "white"}}>{(this.state.activity) ? this.state.activity.name : ""}</Col>
							</Row>
							<Row>
								<Col xs="6" className="text-center" style={{color: "white"}}>Estimated Time:</Col>
								<Col xs="6">
									<FormControl id="estimatedTime" type="datetime-local" placeholder="date" onChange={this.updateEstimatedTime} />                                               
								</Col>
							</Row>
							<Actions setTimer={this.setTimer}
								startCounting={this.startCounting}
								pauseCounting={this.pauseCounting}
								stopCounting={this.stopCounting}
								timer={this.state.timer}
								activity={this.state.activity}
								counting={this.state.counting}
								count={this.state.count}
							/>
							<ActivityList showActivityList={this.state.showActivityList}
								setActivity={this.setActivity}
								addActivity={this.addActivity}
								activities={this.state.activities}
								toggleActivityList={this.toggleActivityList}
							/>
						</Card.Body>
					</Card>
					<Card eventKey = "records" title="records">
						<Card.Body>
							<Records 
								addRecord={this.addRecord} 
								updateRecord={this.updateRecord} 
								deleteRecord={this.deleteRecord} 
								records = {this.state.records} 
								getRecord={this.getRecord}
								controller={this.controller}
							/>
						 </Card.Body>
					</Card>
					<Card eventKey = "userInfo" title="info">
						<Card.Body>
							{isAuthenticated && <LogoutButton />}
							{!isAuthenticated && <LoginButton />}
						</Card.Body>
					</Card>
					
				</Tabs>
			</div>
		);
	}
}

export default withAuth0(TickUrTime);
