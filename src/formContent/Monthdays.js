import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

function Monthdays (props) {

        var monthWeek = [];
        for(var i=0; i<5; i++) {
            var monthdays = [];
            for(var j=0;j<7;j++) {
                var day = j + 1 + 7*i;
                if (day < 32) {
                    day = (day < 10) ? "0"+day : day;
                    monthdays.push(<Form.Check inline id={day} label={day} />);
                }
            }
            monthWeek.push(<InputGroup>{monthdays}</InputGroup>);
        }
        return <Form.Group id="monthdays">{monthWeek}</Form.Group>;
}

export default Monthdays;
