// src/components/adminappointments.js
import React, { useEffect, useState } from 'react';
import { ref, onValue, update, remove } from 'firebase/database';
import { auth, database } from '../firebase';
import emailjs from 'emailjs-com';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [clients, setClients] = useState({});
    const [technicians, setTechnicians] = useState([]);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    useEffect(() => {
        const appointmentsRef = ref(database, 'appointments');
        onValue(appointmentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const allAppointments = [];
                Object.keys(data).forEach((customerId) => {
                    const customerAppointments = data[customerId];
                    Object.keys(customerAppointments).forEach((appointmentId) => {
                        const appointment = customerAppointments[appointmentId];
                        allAppointments.push({
                            id: appointmentId,
                            customerId: customerId,
                            ...appointment,
                        });
                    });
                });
                setAppointments(allAppointments);
            } else {
                console.log("No appointments data available.");
            }
        });

        const techniciansRef = ref(database, 'technicians');
        onValue(techniciansRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const techniciansArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setTechnicians(techniciansArray);
            }
        });
    }, []);

    useEffect(() => {
        const customerIds = appointments.map(appointment => appointment.customerId);
        const uniqueCustomerIds = [...new Set(customerIds)];

        uniqueCustomerIds.forEach((customerId) => {
            const customerRef = ref(database, `customers/${customerId}`);
            onValue(customerRef, (snapshot) => {
                const customerData = snapshot.val();
                if (customerData) {
                    setClients(prevState => ({
                        ...prevState,
                        [customerId]: customerData.name,
                    }));
                }
            });
        });
    }, [appointments]);

    const handleSelectAppointment = (appointmentId) => {
        const selectedAppointment = appointments.find(appointment => appointment.id === appointmentId);
        setAppointmentDetails(selectedAppointment);
        setSelectedAppointmentId(appointmentId);
    };

    const sendTechnicianEmail = (technicianEmail, appointmentDetails) => {
        const templateParams = {
            to_email: technicianEmail,
            service: appointmentDetails.service,
            vehicle: appointmentDetails.vehicle,
            address: appointmentDetails.address,
            date: formatDate(appointmentDetails.date),
            time: formatTime(appointmentDetails.time),
        };

        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID')
            .then((response) => {
                console.log('Email sent successfully!', response.status, response.text);
            })
            .catch((error) => {
                console.error('Error sending email:', error);
            });
    };

    const handleAssignTechnician = (appointmentId, technicianId) => {
        const technician = technicians.find(tech => tech.id === technicianId);
        const updatedAppointment = {
            ...appointmentDetails,
            technician: technician.id,
            status: 'Confirmed',
        };

        const appointmentRef = ref(database, `appointments/${appointmentDetails.customerId}/${appointmentId}`);
        update(appointmentRef, updatedAppointment)
            .then(() => {
                setAppointments(prevAppointments =>
                    prevAppointments.map(app =>
                        app.id === appointmentId ? { ...app, ...updatedAppointment } : app
                    )
                );
                sendTechnicianEmail(technician.email, updatedAppointment); // Enviar e-mail ao técnico
                alert("Technician assigned successfully!");
            })
            .catch((error) => {
                console.error("Error assigning technician:", error);
            });
    };

    const handleCancelAppointment = (appointmentId) => {
        const updatedAppointment = { ...appointmentDetails, status: 'Cancelled' };
        const appointmentRef = ref(database, `appointments/${appointmentDetails.customerId}/${appointmentId}`);
        update(appointmentRef, updatedAppointment)
            .then(() => {
                setAppointments(prevAppointments =>
                    prevAppointments.map(app => app.id === appointmentId ? { ...app, ...updatedAppointment } : app)
                );
                alert("Appointment cancelled successfully!");
            })
            .catch((error) => {
                console.error("Error cancelling the appointment:", error);
            });
    };

    const handleDeleteAppointment = (appointmentId) => {
        const appointmentRef = ref(database, `appointments/${appointmentDetails.customerId}/${appointmentId}`);
        remove(appointmentRef)
            .then(() => {
                setAppointments(prevAppointments =>
                    prevAppointments.filter(app => app.id !== appointmentId)
                );
                alert("Appointment deleted successfully!");
            })
            .catch((error) => {
                console.error("Error deleting the appointment:", error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatTime = (timeString) => {
        const date = new Date(`1970-01-01T${timeString}Z`);
        return date.toLocaleTimeString();
    };

    return (
        <div className="admin-dashboard-container">
            <h2>Admin Dashboard - Manage Appointments</h2>

            <div className="appointment-list">
                <h3>Appointment List</h3>
                <ul>
                    {appointments.length === 0 ? (
                        <p>No appointments available</p>
                    ) : (
                        appointments.map((appointment) => (
                            <li key={appointment.id} onClick={() => handleSelectAppointment(appointment.id)}>
                                <h4>{appointment.service}</h4>
                                <p>{appointment.vehicle} - {appointment.address}</p>
                                <p><strong>Status:</strong> {appointment.status}</p>
                                <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
                                <p><strong>Time:</strong> {formatTime(appointment.time)}</p>
                                <p><strong>Client:</strong> {clients[appointment.customerId] || 'Client not found'}</p>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {appointmentDetails && selectedAppointmentId && (
                <div className="appointment-details">
                    <h3>Appointment Details</h3>
                    <p><strong>Client:</strong> {clients[appointmentDetails.customerId] || 'Client not found'}</p>
                    <p><strong>Vehicle:</strong> {appointmentDetails.vehicle}</p>
                    <p><strong>Service:</strong> {appointmentDetails.service}</p>
                    <p><strong>Address:</strong> {appointmentDetails.address}</p>
                    <p><strong>Date:</strong> {formatDate(appointmentDetails.date)}</p>
                    <p><strong>Time:</strong> {formatTime(appointmentDetails.time)}</p>
                    <p><strong>Status:</strong> {appointmentDetails.status}</p>
                    <p><strong>Technician:</strong> {appointmentDetails.technician || 'Not Assigned'}</p>

                    <div className="actions">
                        <button onClick={() => handleCancelAppointment(appointmentDetails.id)}>Cancel</button>
                        <button onClick={() => handleDeleteAppointment(appointmentDetails.id)}>Delete</button>

                        <div>
                            <label>Assign Technician:</label>
                            <select onChange={(e) => handleAssignTechnician(appointmentDetails.id, e.target.value)}>
                                <option value="">Select a Technician</option>
                                {technicians.map(technician => (
                                    <option key={technician.id} value={technician.id}>{technician.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAppointments;