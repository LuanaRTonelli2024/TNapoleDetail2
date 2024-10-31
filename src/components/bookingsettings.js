// src/components/bookingsettings.js
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set, remove, onValue } from 'firebase/database';
import { database } from '../firebase';

const BookingSettings = () => {
    const [workingDays, setWorkingDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
    const [availableTimes, setAvailableTimes] = useState(['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']);
    const [services, setServices] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [serviceDuration, setServiceDuration] = useState('');
    const [editingServiceId, setEditingServiceId] = useState(null);
    
    const database = getDatabase();

    useEffect(() => {
        fetchServices();
        fetchBookingSettings();
    }, []);

    const fetchServices = () => {
        const servicesRef = ref(database, 'services/');
        onValue(servicesRef, (snapshot) => {
            const data = snapshot.val();
            const servicesArray = data ? Object.values(data) : [];
            setServices(servicesArray);
        });
    };

    const fetchBookingSettings = () => {
        const settingsRef = ref(database, 'bookingSettings/');
        onValue(settingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setWorkingDays(data.workingDays || []);
                setAvailableTimes(data.availableTimes || []);
            }
        });
    };

    const handleWorkingDaysChange = (e) => {
        const { value, checked } = e.target;
        setWorkingDays((prev) =>
            checked ? [...prev, value] : prev.filter(day => day !== value)
        );
    };

    const handleAvailableTimesChange = (e) => {
        const { value, checked } = e.target;
        setAvailableTimes((prev) =>
            checked ? [...prev, value] : prev.filter(time => time !== value)
        );
    };

    const handleServiceDurationChange = (index, e) => {
        const newDuration = e.target.value;
        setServices((prevServices) => {
            const updatedServices = [...prevServices];
            updatedServices[index].duration = newDuration;
            return updatedServices;
        });
    };

    const handleSubmitSettings = async (e) => {
        e.preventDefault();
        const settingsRef = ref(database, 'bookingSettings/');
        try {
            await set(settingsRef, {
                workingDays: workingDays,
                availableTimes: availableTimes
            });
            alert('Settings saved successfully!'); // Mensagem de sucesso
        } catch (error) {
            console.error("Error saving settings: ", error);
            alert('Error saving settings. Please try again.'); // Mensagem de erro
        }
    };

    const handleSubmitService = (e) => {
        e.preventDefault();
        const serviceId = editingServiceId || new Date().getTime().toString();

        const serviceData = {
            id: serviceId,
            name: serviceName,
            duration: Number(serviceDuration),
        };

        const serviceRef = ref(database, 'services/' + serviceId);
        set(serviceRef, serviceData).then(() => {
            setServiceName('');
            setServiceDuration('');
            setEditingServiceId(null);
            fetchServices(); // Atualiza a lista de serviços
        });
    };

    const handleEdit = (service) => {
        setServiceName(service.name);
        setServiceDuration(service.duration);
        setEditingServiceId(service.id);
    };

    const handleDelete = (serviceId) => {
        const serviceRef = ref(database, 'services/' + serviceId);
        remove(serviceRef).then(() => {
            fetchServices(); // Atualiza a lista de serviços
        });
    };

    return (
        <div>
            <h2>Booking Settings</h2>
            <form onSubmit={handleSubmitSettings}>
                <div>
                    <h3>Working Days</h3>
                    {workingDays.map(day => (
                        <label key={day}>
                            <input
                                type="checkbox"
                                value={day}
                                checked={workingDays.includes(day)}
                                onChange={handleWorkingDaysChange}
                            />
                            {day}
                        </label>
                    ))}
                </div>
                <div>
                    <h3>Available Times</h3>
                    {availableTimes.map(time => (
                        <label key={time}>
                            <input
                                type="checkbox"
                                value={time}
                                checked={availableTimes.includes(time)}
                                onChange={handleAvailableTimesChange}
                            />
                            {time}
                        </label>
                    ))}
                </div>
                <button type="submit">Save Booking Settings</button>
            </form>
            <form onSubmit={handleSubmitService}>
                <div>
                    <h3>Manage Services</h3>
                    <input
                        type="text"
                        placeholder="Service Name"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={serviceDuration}
                        onChange={(e) => setServiceDuration(e.target.value)}
                        required
                    />
                    <button type="submit">
                        {editingServiceId ? 'Update Service' : 'Add Service'}
                    </button>
                </div>
            </form>
            <ul>
                {services.map((service) => (
                    <li key={service.id}>
                        {service.name} - {service.duration} minutes
                        <button onClick={() => handleEdit(service)}>Edit</button>
                        <button onClick={() => handleDelete(service.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookingSettings;
 