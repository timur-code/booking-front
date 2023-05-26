import {Form} from "react-bootstrap";
import React from "react";

interface TimePickerProps {
    time: string;
    onTimeChange: (date: string, time: string) => void;
    label: string
}

const TimePicker: React.FC<TimePickerProps> = ({ time, onTimeChange, label }) => {
    const dateValue = time.split('T')[0];
    const timeValue = time.split('T')[1].slice(0, 5);

    return (
        <div className="d-flex flex-column gap-1 p-2 w-25 m-auto">
            <Form.Label>{label}</Form.Label>
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