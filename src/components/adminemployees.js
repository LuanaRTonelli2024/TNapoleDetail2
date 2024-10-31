// src/components/adminemployees.js
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, onValue, set, update, remove } from 'firebase/database';
import { auth, database } from '../firebase';
import './adminemployees.css';

const AdminEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const database = getDatabase();

    useEffect(() => {
        const employeesRef = ref(database, 'employees/');
        const unsubscribe = onValue(employeesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const employeesArray = Object.keys(data).map(key => ({
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
                setEmployees(employeesArray);
            } else {
                console.log("No employees found.");
            }
        });

        return () => unsubscribe();
    }, [database]);

    const handleDelete = (employeeId) => {
        const employeeRef = ref(database, `employees/${employeeId}`);
        remove(employeeRef);
    };

    const handleEditEmployee = async (employeeId) => {
        if (!employeeId) return;

        try {
            const employeeRef = ref(database, `employees/${employeeId}`);
            await update(employeeRef, {
                name: fullName,
                address,
                postalCode,
                city,
                phone,
                mobile,
                role,
                isActive,
            });

            const userRef = ref(database, `users/${employeeId}`);
            await update(userRef, {
                isActive,
            });

            resetForm();
        } catch (error) {
            console.error('Error editing employee:', error);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, 'defaultPassword123');
            const uid = userCredential.user.uid;

            await set(ref(database, 'employees/' + uid), {
                name: fullName,
                address,
                postalCode,
                city,
                phone,
                mobile,
                email,
                role,
                isActive,
            });

            await set(ref(database, 'users/' + uid), {
                email,
                role,
                isActive,
            });

            resetForm();
        } catch (error) {
            console.error('Error adding employee:', error);
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
        setSelectedEmployeeId(null);
        setIsEditing(false);
        setIsAdding(false);
    };

    const handleStartEditing = (employee) => {
        setSelectedEmployeeId(employee.id);
        setFullName(employee.fullName);
        setAddress(employee.address);
        setPostalCode(employee.postalCode);
        setCity(employee.city);
        setPhone(employee.phone);
        setMobile(employee.mobile);
        setEmail(employee.email);
        setRole(employee.role);
        setIsActive(employee.isActive);
        setIsEditing(true);
    };

    const toggleEmployeeDetails = (employeeId) => {
        if (selectedEmployeeId === employeeId) {
            setSelectedEmployeeId(null);
        } else {
            setSelectedEmployeeId(employeeId);
        }
        setIsEditing(false);
    };

    return (
        <div>
            <h2>Employees Management</h2>
            <button onClick={() => { setIsAdding(true); resetForm(); }} className="btn btn-add">New Employee</button>

            {isAdding && (
                <form onSubmit={handleAddEmployee}>
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
                    <input 
                        type="text" 
                        placeholder="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
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
                    <button type="submit" className="btn btn-save">Add Employee</button>
                    <button type="button" onClick={() => { resetForm(); setIsAdding(false); }} className="btn btn-cancel">Cancel</button>
                </form>
            )}

            <ul className="employee-list">
                {employees.map((employee) => (
                    <li key={employee.id}>
                        <div 
                            style={{ cursor: 'pointer' }} 
                            onClick={() => toggleEmployeeDetails(employee.id)}
                        >
                            {employee.fullName}
                        </div>
                        {selectedEmployeeId === employee.id && (
                            <div className="employee-details">
                                <p>
                                    <strong>Email:</strong> {employee.email}
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
                                        employee.address
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
                                        employee.postalCode
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
                                        employee.city
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
                                        employee.phone
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
                                        employee.mobile
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
                                        employee.isActive ? 'Yes' : 'No'
                                    )}
                                </p>
                                {isEditing ? (
                                    <div>
                                        <button onClick={() => handleEditEmployee(selectedEmployeeId)} className="btn btn-save">Save</button>
                                        <button onClick={resetForm} className="btn btn-cancel">Cancel</button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleStartEditing(employee)} className="btn btn-edit">Edit</button>
                                )}
                                <button onClick={() => handleDelete(employee.id)} className="btn btn-danger">Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminEmployees;
