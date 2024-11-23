// src/components/adminservices.js
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set, push, update, remove } from 'firebase/database';
import { auth, database } from '../firebase';
import './adminservices.css';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [executionTime, setExecutionTime] = useState('');
    const [price, setPrice] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const database = getDatabase();

    useEffect(() => {
        const servicesRef = ref(database, 'services/');
        const unsubscribe = onValue(servicesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const servicesArray = Object.keys(data).map(key => ({
                    id: key,
                    serviceName: data[key].serviceName,
                    description: data[key].description,
                    executionTime: data[key].executionTime,
                    price: data[key].price,
                    isActive: data[key].isActive,
                }));
                setServices(servicesArray);
            } else {
                console.log("No services found.");
            }
        });

        return () => unsubscribe();
    }, [database]);

    const handleDelete = (serviceId) => {
        const serviceRef = ref(database, `services/${serviceId}`);
        remove(serviceRef);
    };

    const handleEditService = async (serviceId) => {
        if (!serviceId) return;

        try {
            const serviceRef = ref(database, `services/${serviceId}`);
            await update(serviceRef, {
                serviceName,
                description,
                executionTime,
                price,
                isActive,
            });

            resetForm();
        } catch (error) {
            console.error('Error editing service:', error);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();

        try {
            const newServiceRef = push(ref(database, 'services/'));

            await set(newServiceRef, {
                serviceName,
                description,
                executionTime,
                price,
                isActive,
            });

            resetForm();
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };

    const resetForm = () => {
        setServiceName('');
        setDescription('');
        setExecutionTime('');
        setPrice('');
        setIsActive(true);
        setSelectedServiceId(null);
        setIsEditing(false);
        setIsAdding(true);
    };

    const handleStartEditing = (service) => {
        setSelectedServiceId(service.id);
        setServiceName(service.serviceName);
        setDescription(service.description);
        setExecutionTime(service.executionTime);
        setPrice(service.price);
        setIsActive(service.isActive);
        setIsEditing(true);
    };

    const toggleServiceDetails = (serviceId) => {
        if (selectedServiceId === serviceId) {
            setSelectedServiceId(null);
        } else {
            setSelectedServiceId(serviceId);
        }
        setIsEditing(false);
    };

    return (
        <div>
            <h2>Services Management</h2>
            <button onClick={() => { setIsAdding(true); resetForm(); }} className="btn btn-add">New Service</button>

            {isAdding && (
                <form onSubmit={handleAddService}>
                    <input 
                        type="text" 
                        placeholder="Service Name"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Execution Time"
                        value={executionTime}
                        onChange={(e) => setExecutionTime(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
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
                    <button type="submit" className="btn btn-save">Add Service</button>
                    <button type="button" onClick={() => { resetForm(); setIsAdding(false); }} className="btn btn-cancel">Cancel</button>
                </form>
            )}

            <ul className="service-list">
                {services.map((service) => (
                    <li key={service.id}>
                        <div 
                            style={{ cursor: 'pointer' }} 
                            onClick={() => toggleServiceDetails(service.id)}
                        >
                            {service.serviceName}
                        </div>
                        {selectedServiceId === service.id && (
                            <div className="service-details">
                                <p>
                                    <strong>Description:</strong> {service.description}
                                </p>
                                <p>
                                    <strong>Executin Time:</strong> 
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={executionTime}
                                            onChange={(e) => setExecutionTime(e.target.value)}
                                        />
                                    ) : (
                                        service.executionTime
                                    )}
                                </p>
                                <p>
                                    <strong>Price:</strong> 
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    ) : (
                                        service.price
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
                                        service.isActive ? 'Yes' : 'No'
                                    )}
                                </p>
                                {isEditing ? (
                                    <div>
                                        <button onClick={() => handleEditService(selectedServiceId)} className="btn btn-save">Save</button>
                                        <button onClick={resetForm} className="btn btn-cancel">Cancel</button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleStartEditing(service)} className="btn btn-edit">Edit</button>
                                )}
                                <button onClick={() => handleDelete(service.id)} className="btn btn-danger">Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminServices;
 
 


