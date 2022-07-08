export function formatTime(date) {
	var hr = padZero(date.getHours());
	var min = padZero(date.getMinutes());
	var second = padZero(date.getSeconds());
	return hr + ':' + min + ':' + second;
}

export function formatDate(date) {
	var year = date.getFullYear();
	var month = padZero(date.getMonth() + 1);
	var day = padZero(date.getDate());
	return year + '-' + month + '-' + day;
}

export function formatSeconds(seconds) {
	var hr = parseInt(seconds/3600);
	seconds -= (hr*3600);
	hr = (hr > 0) ? (hr + 'hr ') : "";
	var min = parseInt(seconds/60);
	seconds -= (min*60);
	min = (min > 0) ? (min + 'min ') : "";
	return hr + min + (seconds%60) + 'sec'; 
}

export function padZero(val) {
	if (val < 10) {
		return '0' + val;
	}
	return val;
}
