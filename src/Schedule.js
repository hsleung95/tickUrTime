import React from 'react';

class Schedule extends React.Component {
constructor(props) {
    super(props);
    this.state = {
    };
}
    render() {
        return (
            <div>
                Hello world!
<div onClick={() => this.setState({value:(this.state.value == null) ? this.props.value : this.state.value + this.props.value})}>{this.state.value}</div>
            </div>
        );
    }
}

export default Schedule;
