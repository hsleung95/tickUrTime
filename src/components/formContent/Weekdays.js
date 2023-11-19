import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

function Weekdays (props) {
    return <InputGroup id="weekdays">
                            <Form.Check inline id="1" label="Mon"/>
                            <Form.Check inline id="2" label="Tue"/>
                            <Form.Check inline id="3" label="Wed"/>
                            <Form.Check inline id="4" label="Thu"/>
                            <Form.Check inline id="5" label="Fri"/>
                            <Form.Check inline id="6" label="Sat"/>
                            <Form.Check inline id="7" label="Sun"/>
                        </InputGroup>;
}

export default Weekdays;
