import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function Timer(props) {
	var count = props.count;
	var hr = parseInt(count/3600);
	count -= hr * 3600;
	if (hr < 10) {
		hr = '0' + hr;
	}
	var min = parseInt(count/60);
	count -= min * 60;
	if (min < 10) {
		min = '0' + min;
	}
	var sec = count % 60;
	if (sec < 10) {
		sec = '0' + sec;
	}
	return (
		<div className="timer">

			<div className="timeStr">
				{hr} : {min} : {sec}
			</div>
		</div>
	);
}

export default Timer;
