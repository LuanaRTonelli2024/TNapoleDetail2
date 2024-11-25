// src/components/technicianConfirmService.js
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { auth, database } from '../firebase';
import PaymentLinkButton from './paymentLinkButton';
import './technicianConfirmService.css';

const TechnicianConfirmService = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
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
            const appointmentsRef = ref(database, 'appointments');
            const unsubscribe = onValue(appointmentsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const appointmentsArray = Object.keys(data)
                        .flatMap(customerUid => {
                            return Object.keys(data[customerUid])
                                .map(key => ({
                                    id: key,
                                    ...data[customerUid][key],
                                    customerId: customerUid,
                                }));
                        });
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
    };

    const handleConfirmService = (appointment) => {
        console.log('Confirming service for the appointment:', appointment);

        const user = auth.currentUser;
        if (!user) {
            console.log('User is not authenticated');
            alert('You must be logged in to confirm the service.');
            return;
        }

        const serviceData = {
            service: appointment.service,
            date: appointment.date,
            time: appointment.time,
            vehicle: appointment.vehicle,
            status: 'Completed',
            notes: appointment.notes || '',
            technicianId: user.uid,
            confirmedAt: new Date().toISOString(),
        };

        const newServiceRef = ref(database, `serviceOrders/${user.uid}/${appointment.id}`);
        
        set(newServiceRef, serviceData)
            .then(() => {
                console.log('Service confirmed successfully!');
                setAppointments((prevAppointments) =>
                    prevAppointments.map((appt) =>
                        appt.id === appointment.id ? { ...appt, status: 'Completed' } : appt
                    )
                );
            })
            .catch((error) => {
                console.error('Error confirming the service:', error);
                alert('Error confirming the service. Please try again later.');
            });
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
                            <p>
                                <strong>Date:</strong> {formatDate(appointment.date)}<br />
                                <strong>Time:</strong> {appointment.time}<br />
                                <strong>Vehicle:</strong> {appointment.vehicle}<br />
                                <strong>Status:</strong> {appointment.status || 'Pending'}
                            </p>
                        </div>

                        {selectedAppointmentId === appointment.id && (
                            <div className="appointment-details">
                                <div>
                                    <p><strong>Service:</strong> {appointmentDetails.service}</p>
                                    <p><strong>Date:</strong> {formatDate(appointmentDetails.date)}</p>
                                    <p><strong>Time:</strong> {appointmentDetails.time}</p>
                                    <p><strong>Vehicle:</strong> {appointmentDetails.vehicle}</p>
                                    <p><strong>Status:</strong> {appointmentDetails.status || 'Pending'}</p>
                                    {appointmentDetails.notes && <p><strong>Notes:</strong> {appointmentDetails.notes}</p>}
                                </div>
                                <button 
                                    onClick={() => handleConfirmService(appointment)} 
                                    className="confirm-button"
                                >
                                    Confirm Service Completion
                                </button>
                                <PaymentLinkButton appointment={appointment} />  {/* Componente de pagamento */}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TechnicianConfirmService;
