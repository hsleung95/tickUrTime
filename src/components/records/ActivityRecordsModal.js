import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {formatDates,formatSeconds} from '../../utils/DateUtils.js';

export default function ActivityRecordsModal(props) {

    var records = [];
    if (props.showActivityRecords) {
        var i = 0;
        for (var date in props.activityRecords) {
            props.activityRecords[date].forEach(record => {
                records.push(
                <Row key={i} className="record" onClick={() => {props.setCurrentRecord(record);}}>
                    <Col xs="3" className="text-center">
                        {formatDates(new Date(record.startTime), new Date(record.endTime))}
                    </Col>
                    <Col xs="6" className="text-center">
                    {record.activity.join(',')}
                    </Col>
                    <Col xs="3" className="text-center">
                    {formatSeconds(record.timeSpent)}
                    </Col>
                </Row>);
                i++;
            });
        }
    }
    
    return (
        <Modal className='activity-records-modal' show={props.showActivityRecords} onHide={() => {props.toggleActivityRecordsModal(false)}}>
            <Modal.Header>
                {props.activity}
            </Modal.Header>
            <Modal.Body>
                {records}
            </Modal.Body>
        </Modal>
    );
}