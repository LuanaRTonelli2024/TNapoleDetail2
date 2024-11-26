// src/components/technicianconfirmservice.js
import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';
import PaymentLink from './paymentlink';

const TechnicianConfirmService = () => {
    const [appointments, setAppointments] = useState([]);
    const [appointmentDetails, setAppointmentDetails] = useState(null);

    useEffect(() => {
        // Carregar os agendamentos do banco de dados
        const appointmentsRef = ref(database, 'appointments');
        onValue(appointmentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const filteredAppointments = Object.keys(data)
                    .flatMap(customerId => 
                        Object.keys(data[customerId]).map(appointmentId => ({
                            id: appointmentId,
                            customerId: customerId,
                            ...data[customerId][appointmentId]
                        }))
                    )
                    .filter(appointment => appointment.status !== 'Cancelled' && appointment.technician);
                
                setAppointments(filteredAppointments);
            }
        });
    }, []);

    const handleSelectAppointment = (appointmentId) => {
        const selectedAppointment = appointments.find(appointment => appointment.id === appointmentId);
        setAppointmentDetails(selectedAppointment);
    };

    return (
        <div className="technician-dashboard-container">
            <h2>Technician Dashboard</h2>
            <div className="appointment-list">
                <h3>Assigned Appointments</h3>
                <ul>
                    {appointments.length === 0 ? (
                        <p>No appointments available</p>
                    ) : (
                        appointments.map((appointment) => (
                            <li key={appointment.id} onClick={() => handleSelectAppointment(appointment.id)}>
                                <h4>{appointment.service}</h4>
                                <p>{appointment.vehicle} - {appointment.address}</p>
                                <p><strong>Status:</strong> {appointment.status}</p>
                                <p><strong>Technician:</strong> {appointment.technician}</p>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {appointmentDetails && (
                <div className="appointment-details">
                    <h3>Appointment Details</h3>
                    <p><strong>Client:</strong> {appointmentDetails.customerId}</p>
                    <p><strong>Service:</strong> {appointmentDetails.service}</p>
                    <p><strong>Address:</strong> {appointmentDetails.address}</p>
                    <p><strong>Status:</strong> {appointmentDetails.status}</p>
                    
                    {/* Aqui colocamos o componente PaymentLink */}
                    <PaymentLink 
                        appointmentId={appointmentDetails.id} 
                        clientEmail={appointmentDetails.clientEmail} // Certifique-se de passar o email do cliente
                    />
                </div>
            )}
        </div>
    );
};

export default TechnicianConfirmService;
   
