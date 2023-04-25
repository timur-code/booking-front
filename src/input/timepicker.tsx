import {Form} from "react-bootstrap";
import React from "react";

interface TimePickerProps {
    timeStart: string;
    onTimeChange: (date: string, time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ timeStart, onTimeChange }) => {
    const dateValue = timeStart.split('T')[0];
    const timeValue = timeStart.split('T')[1].slice(0, -4);

    return (
        <div className="d-flex gap-2">
            <Form.Control
                type="date"
                className="modalTextField"
                style={{ paddingRight: '6px' }}
                value={dateValue}
                onChange={(e) => onTimeChange(e.target.value, timeValue)}
            />
            <Form.Control
                type="time"
                className="modalTextField"
                style={{ paddingRight: '6px' }}
                value={timeValue}
                onChange={(e) => onTimeChange(dateValue, e.target.value)}
            />
        </div>
    );
};

export default TimePicker;