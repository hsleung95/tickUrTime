export function formatTime(date) {
	if (date == null) return '';
	var hr = padZero(date.getHours());
	var min = padZero(date.getMinutes());
	var second = padZero(date.getSeconds());
	return hr + ':' + min + ':' + second;
}

export function formatDate(date) {
	if (date == null) return '';
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
	var sec = Math.round(remainSeconds%60);
	var secStr = (hr > 0) ? '' : sec + 'sec';
	return (hrStr + minStr + secStr);
}

export function padZero(val) {
	if (val < 10) {
		return '0' + val;
	}
	return val;
}

export function formatDateVal(date) {
	return formatDate(date) + "T" + formatTime(date);
}

export function formatDates(startTime, endTime) {
	var startDate = startTime.getFullYear() + startTime.getMonth() + startTime.getDate();
	var endDate = endTime.getFullYear() + endTime.getMonth() + endTime.getDate();
	if (endDate > startDate) {
		var startDateStr = formatDate(startTime) + ' ' + formatTime(startTime);
		var endDateStr = formatDate(endTime) + ' ' + formatTime(endTime);
		return  startDateStr + ' To ' + endDateStr;
	} else {
		var dateStr = formatDate(startTime);
		return dateStr + ' ' + formatTime(startTime) + ' To ' + formatTime(endTime);
	}
}