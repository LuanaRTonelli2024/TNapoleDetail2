// src/components/customerbooking.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { auth, database } from '../firebase';
import { ref, set, onValue } from 'firebase/database';
import emailjs from 'emailjs-com';  // Importar EmailJS
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

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const appointmentsRef = ref(database, `appointments/${user.uid}`);
            onValue(appointmentsRef, (snapshot) => {
                const data = snapshot.val();
                const appointmentsArray = data ? Object.values(data) : [];
                setAppointments(appointmentsArray);
            });

            // Fetch booking settings (working days)
            const settingsRef = ref(database, 'bookingSettings/');
            onValue(settingsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setWorkingDays(data.workingDays || []);
                }
            });

            // Fetch services and their durations
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

            // Fetch business hours
            const businessHoursRef = ref(database, 'businessHours/');
            onValue(businessHoursRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setBusinessHours(data);
                    const updatedWorkingDays = Object.keys(data).filter(day => !data[day].isClosed);
                    setWorkingDays(updatedWorkingDays);
                }
            });

            // Fetch vehicles
            const vehiclesRef = ref(database, `vehicles/${user.uid}`);
            onValue(vehiclesRef, (snapshot) => {
                const data = snapshot.val();
                const vehiclesArray = data ? Object.values(data) : [];
                setVehicles(vehiclesArray);
            });
        }
    }, []);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setTime('');
        setError('');

        const selectedDay = newDate.toLocaleString('en-us', { weekday: 'long' });
        const alreadyBooked = appointments.some(appointment =>
            appointment.date.split('T')[0] === selectedDay
        );

        if (alreadyBooked) {
            setAvailableTimes([]);
            setError('An appointment is already scheduled for this day.');
        } else {
            setAvailableTimes(getAvailableTimes(newDate, selectedDay));
        }
    };

    const getAvailableTimes = (date, selectedDay) => {
        const businessDay = businessHours[selectedDay];

        if (!businessDay || businessDay.isClosed) {
            setError('The business is closed on this day.');
            return [];
        }

        const startTime = businessDay.open;
        const endTime = businessDay.close;

        const availableSlots = generateTimeSlots(startTime, endTime, serviceDurations[selectedService]);

        const formattedDate = date.toISOString().split('T')[0];
        const occupiedTimes = appointments
            .filter(appointment => appointment.date.split('T')[0] === formattedDate)
            .map(appointment => appointment.time);

        const availableTimes = availableSlots.filter(slot => !occupiedTimes.includes(slot));
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

    const isValidAppointment = () => {
        const selectedDay = date.toLocaleString('en-us', { weekday: 'long' });
        const isWorkingDay = workingDays.includes(selectedDay);
        const isTimeValid = availableTimes.includes(time);
        const alreadyBooked = appointments.some(appointment =>
            appointment.date.split('T')[0] === selectedDay && appointment.time === time
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
            setError('This time is already booked.');
            return false;
        }
        if (!selectedVehicle) {
            setError('Please select a vehicle.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const user = auth.currentUser;

        if (user && isValidAppointment()) {
            // Gerar o campo Number (ano, mês, dia, hora)
            const formattedDate = date.toISOString();
            const yearMonthDayHour = formattedDate.substring(0, 13).replace(/[-T:]/g, ''); // Exemplo: 2024110909 (2024-11-09 09:00)
            
            const appointmentKey = `${yearMonthDayHour}-${selectedService}`;
            const appointmentRef = ref(database, `appointments/${user.uid}/${appointmentKey}`);
            await set(appointmentRef, { 
                date: formattedDate,
                time,
                service: selectedService,
                vehicle: selectedVehicle,
                Number: yearMonthDayHour
            });

            // Enviar e-mails
            sendEmails(user, formattedDate, time, selectedService, selectedVehicle);

            setShowConfirmation(true);
        }
        setLoading(false);
    };

    const sendEmails = (user, date, time, service, vehicle) => {
        // E-mail para o Cliente
        emailjs.send('service_stfa96j', 'template_uzwwc2q', {
            customer_name: user.displayName || user.email,
            customer_email: user.email,
            service,
            date,
            time,
            vehicle,
        }, 'ixtxPs4UqcvUWMvu5')
            .then((response) => {
                console.log('Email para o cliente enviado!', response.status, response.text);
            })
            .catch((error) => {
                console.error('Erro ao enviar o e-mail para o cliente:', error);
            });

        // E-mail para o Técnico
        emailjs.send('service_stfa96j', 'template_uzwwc2q', {
            technician_email: 'luana_tonelli@hotmail.com',  // E-mail do técnico
            service,
            date,
            time,
            vehicle,
        }, 'ixtxPs4UqcvUWMvu5')
            .then((response) => {
                console.log('Email para o técnico enviado!', response.status, response.text);
            })
            .catch((error) => {
                console.error('Erro ao enviar o e-mail para o técnico:', error);
            });

        // E-mail para o Administrador
        emailjs.send('service_stfa96j', 'template_uzwwc2q', {
            admin_email: 'luanartonelli@gmail.com',  // E-mail do administrador
            service,
            date,
            time,
            vehicle,
            customer_email: user.email,
        }, 'ixtxPs4UqcvUWMvu5')
            .then((response) => {
                console.log('Email para o administrador enviado!', response.status, response.text);
            })
            .catch((error) => {
                console.error('Erro ao enviar o e-mail para o administrador:', error);
            });
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

            {/* Dropdown para selecionar o serviço */}
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

            {/* Dropdown para selecionar o veículo */}
            <div className="vehicle-selection">
                <h3>Select Vehicle</h3>
                <select onChange={handleVehicleSelect} value={selectedVehicle}>
                    <option value="">Select a Vehicle</option>
                    {vehicles.map(vehicle => (
                        <option key={vehicle.name} value={vehicle.name}>
                            {vehicle.name} ({vehicle.model} - {vehicle.year})
                        </option>
                    ))}
                </select>
            </div>

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
                <button type="submit" disabled={loading || !time || !selectedService || !selectedVehicle}>
                    {loading ? 'Scheduling...' : 'Schedule Appointment'}
                </button>
            </form>

            {showConfirmation && <p>Appointment scheduled successfully!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CustomerBooking;
 