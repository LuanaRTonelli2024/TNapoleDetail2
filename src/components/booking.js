// src/components/booking.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { auth, database } from '../firebase';
import { ref, set, onValue } from 'firebase/database';
import 'react-calendar/dist/Calendar.css';
import './booking.css';

const Booking = () => {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [workingDays, setWorkingDays] = useState([]);
    const [serviceDurations, setServiceDurations] = useState({});

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const appointmentsRef = ref(database, `appointments/${user.uid}`);
            onValue(appointmentsRef, (snapshot) => {
                const data = snapshot.val();
                const appointmentsArray = data ? Object.values(data) : [];
                setAppointments(appointmentsArray);
            });

            // Fetch booking settings
            const settingsRef = ref(database, 'bookingSettings/');
            onValue(settingsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setWorkingDays(data.workingDays || []);
                    setAvailableTimes(data.availableTimes || []);
                }
            });

            // Fetch services and their durations
            const servicesRef = ref(database, 'services/');
            onValue(servicesRef, (snapshot) => {
                const data = snapshot.val();
                const servicesArray = data ? Object.values(data) : [];
                const durations = {};
                servicesArray.forEach(service => {
                    durations[service.name] = service.duration;
                });
                setServiceDurations(durations);
            });
        }
    }, []);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setTime('');
        setError('');

        const selectedDay = newDate.toISOString().split('T')[0];
        const alreadyBooked = appointments.some(appointment =>
            appointment.date.split('T')[0] === selectedDay
        );

        if (alreadyBooked) {
            setAvailableTimes([]);
            setError('An appointment is already scheduled for this day.');
        } else {
            setAvailableTimes(getAvailableTimes(newDate));
        }
    };

    const getAvailableTimes = (date) => {
        const day = date.getDay();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDay = dayNames[day];

        if (!workingDays.includes(currentDay)) return []; // Não é um dia útil

        // Retorna horários disponíveis
        return availableTimes;
    };

    const handleTimeSelect = (timeOption) => {
        setTime(timeOption);
        setError('');
    };

    const isValidAppointment = () => {
        const selectedDay = date.toISOString().split('T')[0];
        const isWorkingDay = workingDays.includes(selectedDay);
        const isTimeValid = availableTimes.includes(time);
        const alreadyBooked = appointments.some(appointment =>
            appointment.date.split('T')[0] === selectedDay
        );

        if (!isWorkingDay) {
            setError('The company operates only on selected working days.');
            return false;
        }
        if (!isTimeValid) {
            setError('Please select a valid time based on the available times.');
            return false;
        }
        if (alreadyBooked) {
            setError('An appointment is already scheduled for this day.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const user = auth.currentUser;

        if (user && isValidAppointment()) {
            const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
            const appointmentKey = `${formattedDate}`;
            const appointmentRef = ref(database, `appointments/${user.uid}/${appointmentKey}`);
            await set(appointmentRef, { date: date.toISOString(), time });
            setShowConfirmation(true);
        }
        setLoading(false);
    };

    const tileClassName = ({ date }) => {
        const selectedDay = date.toISOString().split('T')[0];
        const isWorkingDay = workingDays.includes(selectedDay);
        const alreadyBooked = appointments.some(appointment =>
            appointment.date.split('T')[0] === selectedDay
        );

        if (isWorkingDay && !alreadyBooked) {
            return 'react-calendar__month-view__days__day--available';
        } else if (alreadyBooked) {
            return 'react-calendar__month-view__days__day--not-available';
        }
        return '';
    };

    return (
        <div className="booking-container">
            <h2>Schedule an Appointment</h2>
            <div className="calendar-time-container">
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    tileClassName={tileClassName}
                    minDate={new Date()} // Impede a seleção de datas passadas
                />
                <div className="time-selection">
                    <h3>Available Times</h3>
                    <div className="time-buttons">
                        {availableTimes.map((timeOption) => (
                            <button
                                key={timeOption}
                                className={`time-button ${time === timeOption ? 'selected' : ''}`}
                                onClick={() => handleTimeSelect(timeOption)}
                            >
                                {timeOption}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <button type="submit" disabled={loading || !time}>
                    {loading ? 'Scheduling...' : 'Schedule Appointment'}
                </button>
            </form>

            {showConfirmation && <p>Appointment scheduled successfully!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Booking;
