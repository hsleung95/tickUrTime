import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import Clock from './timing/Clock.js';
import Timer from './timing/Timer.js';
import Actions from './Actions.js';
import { Tagging } from './Tagging.js';
// import ActivityList from './unused/ActivityList.js';



class Timing extends React.Component {

    timer;

    constructor(props) {
        super(props);
        this.state = {
            showActivityList: false,
            timer: 'timer',
            count: 0,
			counted: 0,
			counting: false,
			date: null,
            activity: [],
            description: ""
        };
        this.addRecord = props.addRecord.bind(this);

        this.toggleActivityList = this.toggleActivityList.bind(this);
        this.updateActivity = this.updateActivity.bind(this);
        this.updateDescription = this.updateDescription.bind(this);

        this.startCounting = this.startCounting.bind(this);
		this.pauseCounting = this.pauseCounting.bind(this);
		this.stopCounting = this.stopCounting.bind(this);
		this.setTimer = this.setTimer.bind(this);
		this.updateEstimatedTime = this.updateEstimatedTime.bind(this);
    }

    toggleActivityList() {
		this.setState({
			showActivityList: !this.state.showActivityList
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
		this.addRecord(this.state.activity, this.state.description, this.state.date, new Date(), this.state.count);
		this.setState({
			count: 0,
			counted: this.state.count,
			counting: false,
			date: null
		});
	}

    setTimer() {
		this.setState({
            'timer': (this.state.timer == 'timer') ? 'clock' : 'timer'
        });
	}

    updateEstimatedTime(e) {
		this.setState({
			estimatedTime: new Date(e.target.value)
		});
	}

    updateActivity(val) {
		this.setState({
			activity: val
		});
	}

    updateDescription(e) {
		this.setState({
			description: e.target.value
		});
	}


    render() {
        return (
            <div className = "timing tab">
                {/* <Row className="rowActivity">
                    <Col xs="9">
                        <div className="activities">
                            <Dropdown>
                                <Dropdown.Toggle variant="success">
                                    Open Menu
                                </Dropdown.Toggle>
                            <Dropdown.Menu>
                            {this.props.commonlyUsed.map((activity,index) => (
                                <Dropdown.Item  className="btnActivity"
                                                style={{backgroundColor:"#738FA7", border:"none"}}
                                                key={index}
                                                disabled={this.state.activity==activity}
                                                onClick={() => {this.updateActivity(activity);}}
                                >
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
                </Row> */}
                {this.state.timer == 'clock' && <Clock count={this.state.count} />}
                {this.state.timer == 'timer' && <Timer count={this.state.count} />}
                <Row>
                    <Col xs="6" className="text-center ">Activity:</Col>
                    <Col xs="6">
                        <Tagging
								tags={this.state.activity}
								setTags={this.updateActivity}
								name={"activity"}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs="6" className="text-center ">Description:</Col>
                    <Col xs="6" className="text-center ">
                        <FormControl id="description" type="text" value={(this.state.description) ? this.state.description : ""} onChange={this.updateDescription}/>
                    </Col>
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
                {/* <ActivityList showActivityList={this.state.showActivityList}
                    updateActivity={this.updateActivity}
                    addActivity={this.addActivity}
                    activities={this.props.activities}
                    toggleActivityList={this.toggleActivityList}
                /> */}
            </div>
        )
    }
}

export default Timing;