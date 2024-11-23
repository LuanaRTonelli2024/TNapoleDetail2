import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase';
import './customerservicehistory.css';

const CustomerServiceHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState({
        service: '',
        date: '',
        time: '',
        vehicle: '',
        status: '',
        notes: ''
    });

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const appointmentsRef = ref(database, `appointments/${user.uid}`);
            const unsubscribe = onValue(appointmentsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const appointmentsArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key],
                    }));
                    setAppointments(appointmentsArray);
                }
            });

            return () => unsubscribe();
        }
    }, []);

    const handleSelectAppointment = (appointmentId) => {
        if (selectedAppointmentId === appointmentId) {
            setSelectedAppointmentId(null);
        } else {
            setSelectedAppointmentId(appointmentId);
            const selectedAppointment = appointments.find((appointment) => appointment.id === appointmentId);
            setAppointmentDetails(selectedAppointment);
        }
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointmentDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div>
            <h2>Service History</h2>
            <ul className="appointment-list">
                {appointments.map((appointment) => (
                    <li key={appointment.id}>
                        <div 
                            style={{ cursor: 'pointer' }} 
                            onClick={() => handleSelectAppointment(appointment.id)}
                        >
                            <h5>{appointment.service}</h5>
                            <p><strong>Date:</strong> {formatDate(appointment.date)}<strong>  Time:</strong> {appointment.time}<strong>  Vehicle:</strong> {appointment.vehicle}<strong>  Status:</strong> {appointment.status || 'Pending'}</p>
                        </div>

                        {selectedAppointmentId === appointment.id && (
                            <div className="appointment-details">
                                {isEditing ? (
                                    <div>
                                        <input
                                            type="text"
                                            name="service"
                                            value={appointmentDetails.service}
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="text"
                                            name="vehicle"
                                            value={appointmentDetails.vehicle}
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="date"
                                            name="date"
                                            value={appointmentDetails.date}
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="time"
                                            name="time"
                                            value={appointmentDetails.time}
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="text"
                                            name="status"
                                            value={appointmentDetails.status}
                                            onChange={handleChange}
                                        />
                                        <textarea
                                            name="notes"
                                            value={appointmentDetails.notes}
                                            onChange={handleChange}
                                            placeholder="Additional Notes"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <p><strong>Service:</strong> {appointmentDetails.service}</p>
                                        <p><strong>Date:</strong> {formatDate(appointmentDetails.date)}</p>
                                        <p><strong>Time:</strong> {appointmentDetails.time}</p>
                                        <p><strong>Vehicle:</strong> {appointmentDetails.vehicle}</p>
                                        <p><strong>Status:</strong> {appointmentDetails.status || 'Pending'}</p>
                                        {appointmentDetails.notes && <p><strong>Notes:</strong> {appointmentDetails.notes}</p>}
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerServiceHistory;
