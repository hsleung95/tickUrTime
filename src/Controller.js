import axios from "axios";

class Controller {
	
	url;
	
	constructor() {
		this.url = "http://tickurtimebackend-env.eba-v8pmauvm.us-west-1.elasticbeanstalk.com";
	}
	
	async getActivityRecord() {
		return await axios.get(this.url + "/activityRecords", window.globalConfig)
			.then(res => {
				return res.data;
			}).catch(err => {
				console.log(err);
				return [];
			});
	}
	
	async addActivityRecord(record) {
		return await axios.post(this.url + "/activityRecords",record, window.globalConfig)
		.then((data) => {
			console.log(data);
			return data
		}).catch(err => {
				console.log(err);
				return [];
			});
	}
	
	async updateActivityRecord(id,record) {
		return await axios.put(this.url + "/activityRecords/" + id,record, window.globalConfig)
		.then((data) => {
			return data;
		});
	}
	
	async deleteActivityRecord(id) {
		return await axios.delete(this.url + "/activityRecords/" + id, window.globalConfig)
		.then((data) => {
			return data;
		});
	}
	
	async getActivities() {
		return await axios.get(this.url + "/activities", window.globalConfig)
			.then(res => {
				return res.data;
			}).catch(err => {
				console.log(err);
				return [];
			});
	}
	
	async addActivity(activity) {
		return await axios.post(this.url + "/activities",activity, window.globalConfig)
		.then((data) => {
			console.log(data);
			return data
		});
	}
	
	async updateActivity(id,activity) {
		return await axios.put(this.url + "/activities/" + id,activity, window.globalConfig)
		.then((data) => {
			return data
		});
	}
	
	async deleteActivity(id) {
		return await axios.delete(this.url + "/activities/" + id, window.globalConfig)
		.then((data) => {
			return data
		});
	}
	
	async getToken() {
		return await axios.post(this.url + "/token")
		.then((data) => {
			return data.data.token;
		});
	}
	
	async putToken(oldToken, newToken) {
		var params = {oldToken: oldToken, newToken: newToken};
		axios.put(this.url + "/token", params);
	}
}

export default Controller;
