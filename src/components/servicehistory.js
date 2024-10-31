// src/components/ServiceHistory.js
import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const ServiceHistory = () => {
    const [serviceHistory, setServiceHistory] = useState([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const serviceHistoryRef = ref(database, `serviceHistory/${user.uid}`);
            onValue(serviceHistoryRef, (snapshot) => {
                const data = snapshot.val();
                const historyArray = data ? Object.values(data) : [];
                setServiceHistory(historyArray);
            });
        }
    }, []);

    return (
        <div>
            <h2>Your Service History</h2>
            <ul>
                {serviceHistory.map((service, index) => (
                    <li key={index}>
                        Date: {new Date(service.date).toLocaleDateString()} - Service: {service.description}
                    </li>
                ))}
                {serviceHistory.length === 0 && <p>No service history available.</p>}
            </ul>
        </div>
    );
};

export default ServiceHistory;
