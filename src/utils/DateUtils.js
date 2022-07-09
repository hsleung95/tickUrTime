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
	var remainSeconds = seconds;
	var hr = parseInt(remainSeconds/3600);
	remainSeconds -= (hr*3600);
	var hrStr = (hr > 0) ? (hr + 'hr ') : "";
	var min = parseInt(remainSeconds/60);
	remainSeconds -= (min*60);
	var minStr = (min > 0) ? (min + 'min ') : "";
	var sec = remainSeconds%60;
	var secStr = (hr > 0) ? '' : sec + 'sec';
	return (hrStr + minStr + secStr);
}

export function padZero(val) {
	if (val < 10) {
		return '0' + val;
	}
	return val;
}
