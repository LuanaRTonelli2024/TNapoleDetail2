// src/components/customerbooking.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { auth, database } from '../firebase';
import { ref, set, onValue } from 'firebase/database';
import emailjs from 'emailjs-com';
import 'react-calendar/dist/Calendar.css';
import './customerbooking.css';

const CustomerBooking = () => {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [workingDays, setWorkingDays] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [serviceDurations, setServiceDurations] = useState({});
    const [businessHours, setBusinessHours] = useState({});
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [technician, setTechnician] = useState('');
    const [status, setStatus] = useState('Pending');

    useEffect(() => {
        const user = auth.currentUser ;
        if (user) {
            const appointmentsRef = ref(database, `appointments/${user.uid}`);
            onValue(appointmentsRef, (snapshot) => {
                const data = snapshot.val();
                const appointmentsArray = data ? Object.values(data) : [];
                setAppointments(appointmentsArray);
            });

            const settingsRef = ref(database, 'bookingSettings/');
            onValue(settingsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setWorkingDays(data.workingDays || []);
                }
            });

            const servicesRef = ref(database, 'services/');
            onValue(servicesRef, (snapshot) => {
                const data = snapshot.val();
                const servicesArray = data ? Object.values(data) : [];
                setServices(servicesArray);
                const durations = {};
                servicesArray.forEach(service => {
                    durations[service.serviceName] = parseInt(service.executionTime, 10);
                });
                setServiceDurations(durations);
            });

            const businessHoursRef = ref(database, 'businessHours/');
            onValue(businessHoursRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setBusinessHours(data);
                    const updatedWorkingDays = Object.keys(data).filter(day => !data[day].isClosed);
                    setWorkingDays(updatedWorkingDays);
                }
            });

            const vehiclesRef = ref(database, `customers/${user.uid}/vehicles`);
            onValue(vehiclesRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const vehiclesArray = Object.values(data);
                    setVehicles(vehiclesArray);
                } else {
                    setVehicles([]);
                }
            });

            const customerRef = ref(database, `customers/${user.uid}/addresses`);
            onValue(customerRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const addressArray = Object.values(data);
                    setAddresses(addressArray);
                }
            });
        }
    }, []);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setTime('');
        setError('');
        const selectedDay = newDate.toLocaleString('en-us', { weekday: 'long' });
        const alreadyBooked = appointments.some(appointment =>
            appointment.date && appointment.date.split('T')[0] === newDate.toISOString().split('T')[0]
        );

        if (alreadyBooked) {
            setAvailableTimes([]);
            setError('An appointment is already scheduled for this day.');
        } else {
            setAvailableTimes(getAvailableTimes(newDate, selectedDay));
        }
    };

    const getAvailableTimes = (date, selectedDay) => {
        if (!businessHours || !selectedDay) {
            setError('Business hours are not available.');
            return [];
        }

        const businessDay = businessHours[selectedDay] || { isClosed: true };

        if (businessDay.isClosed || !businessDay.open || !businessDay.close ) {
            setError('The business is closed on this day.');
            return [];
        }

        const startTime = businessDay.open;
        const endTime = businessDay.close;
        const serviceDuration = serviceDurations[selectedService] || 0;

        if (!serviceDuration) {
            setError('Please select a service to view available times.');
            return [];
        }

        const availableSlots = generateTimeSlots(startTime, endTime, serviceDuration);
        const formattedDate = date.toISOString().split('T')[0];
        const occupiedTimes = appointments
            .filter(appointment => appointment.date && appointment.date.split('T')[0] === formattedDate)
            .map(appointment => appointment.time);

        const availableTimes = availableSlots.filter(slot => !occupiedTimes.includes(slot));
        setError('');
        return availableTimes;
    };

    const generateTimeSlots = (startTime, endTime, duration) => {
        const start = convertToMinutes(startTime);
        const end = convertToMinutes(endTime);
        const slots = [];

        for (let time = start; time + duration <= end; time += duration) {
            slots.push(convertToTimeFormat(time));
        }

        return slots;
    };

    const convertToMinutes = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const convertToTimeFormat = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    const tileClassName = ({ date }) => {
        const dayOfWeek = date.toLocaleString('en-us', { weekday: 'long' });
        const isWorkingDay = workingDays.includes(dayOfWeek);
        const alreadyBooked = appointments.some(appointment =>
            appointment.date && appointment.date.split('T')[0] === date.toISOString().split('T')[0]
        );

        if (isWorkingDay && !alreadyBooked) {
            return 'react-calendar__month-view__days__day--available';
        } else if (alreadyBooked) {
            return 'react-calendar__month-view__days__day--not-available';
        }
        return '';
    };

    const handleTimeSelect = (timeOption) => {
        setTime(timeOption);
        setError('');
    };

    const handleServiceSelect = (event) => {
        const serviceName = event.target.value;
        setSelectedService(serviceName);
        setTime('');
        setError('');
    };

    const handleVehicleSelect = (event) => {
        setSelectedVehicle(event.target.value);
        setError('');
    };

    const handleAddressSelect = (event) => {
        setSelectedAddress(event.target.value);
        setError('');
    };

    const sendEmails = (user, date, time, service, vehicle) => {
        const userEmail = user.email;
        const customerName = user.displayName || userEmail;

        console.log('Sending email to:', userEmail);
        console.log('Email data:', {
            to_email: userEmail,
            customer_name: customerName,
            service: service,
            date: date,
            time: time,
            vehicle: vehicle,
        });

        emailjs.send('service_stfa96j', 'template_uzwwc2q', {
            to_email: userEmail,
            customer_name: customerName,
            customer_email: userEmail,
            service: service,
            date: date,
            time: time,
            vehicle: vehicle,
        }, 'ixtxPs4UqcvUWMvu5')
        .then((response) => {
            console.log('Email para o cliente enviado!', response.status, response.text);
        })
        .catch((error) => {
            console.error('Erro ao enviar o e-mail para o cliente:', error);
        });

        const adminEmail = 'luanartonelli@gmail.com';
        const adminName = 'Luana Tonelli';

        emailjs.send('service_stfa96j', 'template_uzwwc2q', {
            to_email: adminEmail,
            customer_name: adminName,
            customer_email: adminEmail,
            service: service,
            date: date,
            time: time,
            vehicle: vehicle,
        }, 'ixtxPs4UqcvUWMvu5')
        .then((response) => {
            console.log('Email para o administrador enviado!', response.status, response.text);
        })
        .catch((error) => {
            console.error('Erro ao enviar o e-mail para o administrador:', error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const user = auth.currentUser ;

        if (user) {
            const formattedDate = date.toISOString();
            const yearMonthDayHour = formattedDate.substring(0, 13).replace(/[-T:]/g, '');
            const appointmentKey = `${yearMonthDayHour}-${selectedService}`;
            const appointmentRef = ref(database, `appointments/${user.uid}/${appointmentKey}`);
            await set(appointmentRef, { 
                date: formattedDate,
                time,
                service: selectedService,
                vehicle: selectedVehicle,
                address: selectedAddress,
                technician,
                status,
                Number: yearMonthDayHour
            });

            // Enviar e-mails após agendar
            sendEmails(user, formattedDate, time, selectedService, selectedVehicle);

            setShowConfirmation(true);
        }
        setLoading(false);
    };

    return (
        <div className="booking-container">
            <h2>Schedule an Appointment</h2>

            <div className="dropdown-container">
                <div className="service-selection">
                    <h3>Select Service</h3>
                    <select onChange={handleServiceSelect} value={selectedService}>
                        <option value="">Select a Service</option>
                        {services.map(service => (
                            <option key={service.serviceName} value={service.serviceName}>
                                {service.serviceName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="vehicle-selection">
                    <h3>Select Vehicle</h3>
                    <select onChange={handleVehicleSelect} value={selectedVehicle}>
                        <option value="">Select a Vehicle</option>
                        {vehicles.map((vehicle, index) => (
                            <option key={index} value={vehicle.nickName}>
                                {vehicle.nickName} ({vehicle.model} - {vehicle.color})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="address-selection">
                    <h3>Select Address</h3>
                    <select onChange={handleAddressSelect} value={selectedAddress}>
                        <option value="">Select an Address</option>
                        {addresses.map((address, index) => (
                            <option key={index} value={address.nickName}>
                                {address.nickName} - {address.city}, {address.postalCode}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="calendar-time-container">
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    tileClassName={tileClassName}
                    minDate={new Date()}
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
                <button type="submit" disabled={loading || !time || !selectedService || !selectedVehicle || !selectedAddress}>
                    {loading ? 'Scheduling...' : 'Schedule Appointment'}
                </button>
            </form>

            {showConfirmation && <p>Appointment scheduled successfully!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CustomerBooking;