//src/components/admincustomers.js
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, onValue, set, update, remove } from 'firebase/database';
import { auth, database } from '../firebase';
import './admincustomers.css';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('customer');
    const [isActive, setIsActive] = useState(true);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const database = getDatabase();

    useEffect(() => {
        const customersRef = ref(database, 'customers/');
        const unsubscribe = onValue(customersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const customersArray = Object.keys(data).map(key => ({
                    id: key,
                    fullName: data[key].name,
                    address: data[key].address,
                    postalCode: data[key].postalCode,
                    city: data[key].city,
                    phone: data[key].phone,
                    mobile: data[key].mobile,
                    email: data[key].email,
                    role: data[key].role,
                    isActive: data[key].isActive,
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

    const handleEditCustomer = async (customerId) => {
        if (!customerId) return;

        try {
            const customerRef = ref(database, `customers/${customerId}`);
            await update(customerRef, {
                name: fullName,
                address,
                postalCode,
                city,
                phone,
                mobile,
                isActive,
            });

            const userRef = ref(database, `users/${customerId}`);
            await update(userRef, {
                isActive,
            });

            resetForm();
        } catch (error) {
            console.error('Error editing customer:', error);
        }
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, 'defaultPassword123');
            const uid = userCredential.user.uid;

            await set(ref(database, 'customers/' + uid), {
                name: fullName,
                address,
                postalCode,
                city,
                phone,
                mobile,
                email,
                role: 'customer',
                isActive,
            });

            await set(ref(database, 'users/' + uid), {
                email,
                role: 'customer',
                isActive,
            });

            resetForm();
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const resetForm = () => {
        setFullName('');
        setAddress('');
        setPostalCode('');
        setCity('');
        setPhone('');
        setMobile('');
        setEmail('');
        setRole('');
        setIsActive(true);
        setSelectedCustomerId(null);
        setIsEditing(false);
        setIsAdding(true);
    };

    const handleStartEditing = (customer) => {
        setSelectedCustomerId(customer.id);
        setFullName(customer.fullName);
        setAddress(customer.address);
        setPostalCode(customer.postalCode);
        setCity(customer.city);
        setPhone(customer.phone);
        setMobile(customer.mobile);
        setEmail(customer.email);
        setRole(customer.role);
        setIsActive(customer.isActive);
        setIsEditing(true);
    };

    const toggleCustomerDetails = (customerId) => {
        if (selectedCustomerId === customerId) {
            setSelectedCustomerId(null);
        } else {
            setSelectedCustomerId(customerId);
        }
        setIsEditing(false);
    };

    return (
        <div>
            <h2>Customers Management</h2>
            <button onClick={() => { setIsAdding(true); resetForm(); }} className="btn btn-add">New Customer</button>

            {isAdding && (
                <form onSubmit={handleAddCustomer}>
                    <input 
                        type="text" 
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                    />
                    <input 
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>
                        <strong>Active:</strong>
                        <input 
                            type="checkbox" 
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                    </label>
                    <button type="submit" className="btn btn-save">Add Customer</button>
                    <button type="button" onClick={() => { resetForm(); setIsAdding(false); }} className="btn btn-cancel">Cancel</button>
                </form>
            )}

            <ul className="customer-list">
                {customers.map((customer) => (
                    <li key={customer.id}>
                        <div 
                            style={{ cursor: 'pointer' }} 
                            onClick={() => toggleCustomerDetails(customer.id)}
                        >
                            {customer.fullName}
                        </div>
                        {selectedCustomerId === customer.id && (
                            <div className="customer-details">
                                <p>
                                    <strong>Email:</strong> {customer.email}
                                </p>
                                <p>
                                    <strong>Address:</strong> 
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    ) : (
                                        customer.address
                                    )}
                                </p>
                                <p>
                                    <strong>Postal Code:</strong> 
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                        />
                                    ) : (
                                        customer.postalCode
                                    )}
                                </p>
                                <p>
                                    <strong>City:</strong> 
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        />
                                    ) : (
                                        customer.city
                                    )}  
                                </p>
                                <p>
                                    <strong>Phone:</strong> 
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    ) : (
                                        customer.phone
                                    )}
                                </p>
                                <p>
                                    <strong>Mobile:</strong> 
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                        />
                                    ) : (
                                        customer.mobile
                                    )}
                                </p>
                                <p>
                                    <strong>Active:</strong> 
                                    {isEditing ? (
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={(e) => setIsActive(e.target.checked)}
                                        />    
                                    ) : (
                                        customer.isActive ? 'Yes' : 'No'
                                    )}
                                </p>
                                {isEditing ? (
                                    <div>
                                        <button onClick={() => handleEditCustomer(selectedCustomerId)} className="btn btn-save">Save</button>
                                        <button onClick={resetForm} className="btn btn-cancel">Cancel</button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleStartEditing(customer)} className="btn btn-edit">Edit</button>
                                )}
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

