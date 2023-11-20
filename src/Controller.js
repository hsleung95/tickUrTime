import axios from "axios";
import { formatDateVal } from "./utils/DateUtils";

class Controller {
	
	url;
	queues = ["addActivityRecord","updateActivityRecord","deleteActivityRecord","addActivity","updateActivity","deleteActivity"];
	
	constructor() {
		this.url = (process.env && process.env.CONNECTION_URL) ? process.env.CONNECTION_URL : "http://localhost:8080";
	}

	formatStartTime(startTime) {
		if (startTime == null) return null;
		var startDate = new Date(startTime);
		startDate.setHours(0);
		startDate.setMinutes(0);
		startDate.setSeconds(0);
		return formatDateVal(startDate);
	}

	formatEndTime(endTime) {
		if (endTime == null) return null;
		var endDate = new Date(endTime);
		endDate.setHours(23);
		endDate.setMinutes(59);
		endDate.setSeconds(59);
		return formatDateVal(endDate);
	}

	async getActivityRecord(id) {
		var params = "/activityRecords/" + id;
		return await axios.get(this.url + params, window.globalConfig)
			.then(res => {
				localStorage.setItem("activityRecords", JSON.stringify(res.data));
				return res.data;
			}).catch(err => {
				console.log(err);
				return JSON.parse(localStorage.getItem("activityRecords"));
			});
	}
	
	async getRecords(activity = null, startTime = null, endTime = null) {
		var params = "/activityRecords";
		var activityParam = (activity == null) ? "" : "activity=" + activity;
		var startTimeParam = (startTime == null) ? "" : "startTime=" + this.formatStartTime(startTime);
		var endTimeParam = (endTime == null) ? "" : "endTime=" + this.formatEndTime(endTime);
		if (activityParam != "" || startTimeParam != "" || endTimeParam != "") {
			params = params + "?" + activityParam + "&" + startTimeParam + "&" + endTimeParam;
		}
		return await axios.get(this.url + params, window.globalConfig)
			.then(res => {
				localStorage.setItem("activityRecords", JSON.stringify(res.data));
				return res.data;
			}).catch(err => {
				console.log(err);
				return JSON.parse(localStorage.getItem("activityRecords"));
			});
	}

	async getRecordsSummary(startTime = null, endTime = null) {
		var params = "/activityRecords/summary";
		var startTimeParam = (startTime == null) ? "" : "startTime=" + this.formatStartTime(startTime);
		var endTimeParam = (endTime == null) ? "" : "endTime=" + this.formatEndTime(endTime);
		if (startTimeParam != "" || endTimeParam != "") {
			params = params + "?" + startTimeParam + "&" + endTimeParam;
		}
		return await axios.get(this.url + params, window.globalConfig)
			.then(res => {
				localStorage.setItem("activityRecords", JSON.stringify(res.data));
				return res.data;
			}).catch(err => {
				console.log(err);
				return JSON.parse(localStorage.getItem("activityRecords"));
			});
	}
	
	async addActivityRecord(record) {
		return await axios.post(this.url + "/activityRecords",record, window.globalConfig)
			.then((data) => {
				return data
			}).catch(err => {
				console.log(err);
				this.addPending("addActivityRecord", null, record);
				return [];
			});
	}
	
	async updateActivityRecord(id,record) {
		return await axios.put(this.url + "/activityRecords/" + id,record, window.globalConfig)
			.then((data) => {
				return data;
			}).catch(err => {
				console.log(err);
				this.addPending("updateActivityRecord", id, record);
			});
	}
	
	async deleteActivityRecord(id) {
		return await axios.delete(this.url + "/activityRecords/" + id, window.globalConfig)
			.then((data) => {
				return data;
			}).catch(err => {
				console.log(err);
				this.addPending("deleteActivityRecord", id, null);
			});
	}
	
	async getActivities() {
		return await axios.get(this.url + "/activities", window.globalConfig)
			.then(res => {
				localStorage.setItem("activities", JSON.stringify(res.data));
				return res.data;
			}).catch(err => {
				console.log(err);
				return JSON.parse(localStorage.getItem("activities"));
			});
	}
	
	async addActivity(activity) {
		return await axios.post(this.url + "/activities",activity, window.globalConfig)
			.then((data) => {
				console.log(data);
				return data
			}).catch(err => {
				console.log(err);
				this.addPending("addActivity", null, activity);
			});
	}
	
	async updateActivity(id,activity) {
		return await axios.put(this.url + "/activities/" + id,activity, window.globalConfig)
			.then((data) => {
				return data
			}).catch(err => {
				console.log(err);
				this.addPending("updateActivity", id, activity);
			});
	}
	
	async deleteActivity(id) {
		return await axios.delete(this.url + "/activities/" + id, window.globalConfig)
			.then((data) => {
				return data
			}).catch(err => {
				console.log(err);
				this.addPending("deleteActivity", id, null);
			});
	}

	localAdd(type, pending, record) {
		var len = (localStorage.getItem(type) == null) ? 0 : JSON.parse(localStorage.getItem("addActivityRecord")).length;
		record.id = "pending" + len;
		var list = JSON.parse(localStorage.getItem("activityRecords"));
		list.add(record);
		localStorage.setItem("activityRecords", JSON.stringify(list));
	}
	
	async getToken() {
		return await axios.post(this.url + "/token")
			.then((data) => {
				return data.data.token;
			});
	}
	
	async putToken(oldToken, newToken) {
		var params = {oldToken: oldToken, newToken: newToken};
		axios.put(this.url +"/token", params);
	}

	addPending(queue, id, content) {
		if (localStorage.getItem(queue) == null) {
			localStorage.setItem(queue, "[]");
		}
		var list = JSON.parse(localStorage.getItem(queue));
		var item = {"id": id, "content": content};
		list.add(item);
		localStorage.setItem(queue, JSON.stringify(list));
	}

	handlePending() {
		this.queues.forEach(queue => {
			var list = JSON.parse(localStorage.getItem(queue));
			while (list.length > 0) {
				var item = list[0];
				if (item.id == null) {
					window[queue](item.content);
				}
				else if (item.content == null) {
					window[queue](item.id);
				}
				else {
					window[queue](item.id, item.content);
				}
				list.shift();
				localStorage.setItem(queue, JSON.stringify(list));
			}
		});
	}
}

export default Controller;
