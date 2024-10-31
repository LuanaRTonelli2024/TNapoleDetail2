//src/components/admincustomers.js
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { database } from '../firebase';
import './admincustomers.css';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const db = getDatabase();

    useEffect(() => {
        const customersRef = ref(database, 'customers/');
        const unsubscribe = onValue(customersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const customersArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setCustomers(customersArray);
            } else {
                console.log("No customers found.");
            }
        });

        return () => unsubscribe();
    }, [database]);

    const handleDelete = (customerId) => {
        const customerRef = ref(database, `customers/${customerId}`);
        remove(customerRef);
    };

    return (
        <div>
            <h2>Customer Management</h2>
            <ul className="customer-list">
                {customers.map((customer) => (
                    <li key={customer.id}>
                        <div onClick={() => setSelectedCustomerId(customer.id)} style={{ cursor: 'pointer' }}>
                            {customer.fullName}
                        </div>
                        {selectedCustomerId === customer.id && (
                            <div className="customer-details">
                                <p><strong>Email:</strong> {customer.email}</p>
                                <p><strong>Address:</strong> {customer.address}</p>
                                <p><strong>Postal Code:</strong> {customer.postalCode}</p>
                                <p><strong>City:</strong> {customer.city}</p>
                                <p><strong>Phone:</strong> {customer.phone}</p>
                                <p><strong>Mobile:</strong> {customer.mobile}</p>
                                <button onClick={() => handleDelete(customer.id)} className="btn btn-danger">Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminCustomers;
