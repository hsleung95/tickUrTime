function Clock(props) {
		return (
				<div className="clock">
					<div className="number twelve">12</div>
					<div className="number three">3</div>
					<div className="number six">6</div>
					<div className="number nine">9</div>
					<div className="hr"  style={{transform: 'rotate(' + (parseInt(props.count / 3600) * 30) + 'deg)'}} />
					<div className="min" style={{transform: 'rotate(' + (parseInt(props.count / 60) * 6) + 'deg)'}} />
					<div className="sec" style={{transform: 'rotate(' + (props.count % 60 * 6) + 'deg)'}} />
				</div>
		);
}

export default Clock;
