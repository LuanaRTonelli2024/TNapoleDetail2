//src/components/admintechnicians.js
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, onValue, set, update, remove } from 'firebase/database';
import { auth, database } from '../firebase';
import './admintechnicians.css';

const AdminTechnicians = () => {
    const [technicians, setTechnicians] = useState([]);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('detailtechnician');
    const [isActive, setIsActive] = useState(true);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const database = getDatabase();

    useEffect(() => {
        const techniciansRef = ref(database, 'technicians/');
        const unsubscribe = onValue(techniciansRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const techniciansArray = Object.keys(data).map(key => ({
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
                setTechnicians(techniciansArray);
            } else {
                console.log("No technicians found.");
            }
        });

        return () => unsubscribe();
    }, [database]);

    const handleDelete = (technicianId) => {
        const technicianRef = ref(database, `technicians/${technicianId}`);
        remove(technicianRef);
    };

    const handleEditTechnician = async (technicianId) => {
        if (!technicianId) return;

        try {
            const technicianRef = ref(database, `technicians/${technicianId}`);
            await update(technicianRef, {
                name: fullName,
                address,
                postalCode,
                city,
                phone,
                mobile,
                isActive,
            });

            const userRef = ref(database, `users/${technicianId}`);
            await update(userRef, {
                isActive,
            });

            resetForm();
        } catch (error) {
            console.error('Error editing technician:', error);
        }
    };

    const handleAddTechnician = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, 'defaultPassword123');
            const uid = userCredential.user.uid;

            await set(ref(database, 'technicians/' + uid), {
                name: fullName,
                address,
                postalCode,
                city,
                phone,
                mobile,
                email,
                role: 'detailtechnician',
                isActive,
            });

            await set(ref(database, 'users/' + uid), {
                email,
                role: 'detailtechnician',
                isActive,
            });

            resetForm();
        } catch (error) {
            console.error('Error adding detail technician:', error);
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
        setSelectedTechnicianId(null);
        setIsEditing(false);
        setIsAdding(true);
    };

    const handleStartEditing = (technician) => {
        setSelectedTechnicianId(technician.id);
        setFullName(technician.fullName);
        setAddress(technician.address);
        setPostalCode(technician.postalCode);
        setCity(technician.city);
        setPhone(technician.phone);
        setMobile(technician.mobile);
        setEmail(technician.email);
        setRole(technician.role);
        setIsActive(technician.isActive);
        setIsEditing(true);
    };

    const toggleTechnicianDetails = (technicianId) => {
        if (selectedTechnicianId === technicianId) {
            setSelectedTechnicianId(null);
        } else {
            setSelectedTechnicianId(technicianId);
        }
        setIsEditing(false);
    };

    return (
        <div>
            <h2>Detail Technicians Management</h2>
            <button onClick={() => { setIsAdding(true); resetForm(); }} className="btn btn-add">New Technician</button>

            {isAdding && (
                <form onSubmit={handleAddTechnician}>
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
                    <button type="submit" className="btn btn-save">Add Detail Technician</button>
                    <button type="button" onClick={() => { resetForm(); setIsAdding(false); }} className="btn btn-cancel">Cancel</button>
                </form>
            )}

            <ul className="technician-list">
                {technicians.map((technician) => (
                    <li key={technician.id}>
                        <div 
                            style={{ cursor: 'pointer' }} 
                            onClick={() => toggleTechnicianDetails(technician.id)}
                        >
                            {technician.fullName}
                        </div>
                        {selectedTechnicianId === technician.id && (
                            <div className="technician-details">
                                <p>
                                    <strong>Email:</strong> {technician.email}
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
                                        technician.address
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
                                        technician.postalCode
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
                                        technician.city
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
                                        technician.phone
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
                                        technician.mobile
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
                                        technician.isActive ? 'Yes' : 'No'
                                    )}
                                </p>
                                {isEditing ? (
                                    <div>
                                        <button onClick={() => handleEditTechnician(selectedTechnicianId)} className="btn btn-save">Save</button>
                                        <button onClick={resetForm} className="btn btn-cancel">Cancel</button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleStartEditing(technician)} className="btn btn-edit">Edit</button>
                                )}
                                <button onClick={() => handleDelete(technician.id)} className="btn btn-danger">Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminTechnicians;
