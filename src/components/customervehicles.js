//src/components/customervehicles.js
import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase';
import { getDatabase, ref, onValue, set, update, remove } from 'firebase/database';
import './customervehicles.css';

const CustomerVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [nickName, setNickName] = useState('');
    const [branch, setBranch] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [color, setColor] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);

    const database = getDatabase();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const vehicleRef = ref(database, `customers/${user.uid}/vehicles/`);
            const unsubscribe = onValue(vehicleRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const vehiclesArray = Object.keys(data).map(key => ({
                        id: key,
                        nickName: data[key].nickName,
                        branch: data[key].branch,
                        model: data[key].model,
                        year: data[key].year,
                        color: data[key].color,
                    }));
                    setVehicles(vehiclesArray);
                } else {
                    console.log("No vehicles found.");
                }
            });

            return () => unsubscribe();
        }
    }, [database]);

    const handleDelete = (vehicleId) => {
        const vehicleRef = ref(database, `customers/${auth.currentUser.uid}/vehicles/${vehicleId}`);
        remove(vehicleRef);
    };

    const handleEditVehicle = async (vehicleId) => {
        if (!vehicleId) return;

        try {
            const vehicleRef = ref(database, `customers/${auth.currentUser.uid}/vehicles/${vehicleId}`);
            await update(vehicleRef, {
                nickName,
                branch,
                model,
                year,
                color,
            });
            resetForm();
        } catch (error) {
            console.error('Error editing vehicle:', error);
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();

        try {
            const user = auth.currentUser;
            if (user) {
                const uid = user.uid;
                await set(ref(database, `customers/${uid}/vehicles/${Date.now()}`), {
                    nickName,
                    branch,
                    model,
                    year,
                    color,
                });
                resetForm();
            } else {
                console.log("No user logged in.");
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    const resetForm = () => {
        setNickName('');
        setBranch('');
        setModel('');
        setYear('');
        setColor('');
        setSelectedVehicleId(null);
        setIsEditing(false);
        setIsAdding(true);
    };

    const handleStartEditing = (vehicle) => {
        setSelectedVehicleId(vehicle.id);
        setNickName(vehicle.nickName);
        setBranch(vehicle.branch);
        setModel(vehicle.model);
        setYear(vehicle.year);
        setColor(vehicle.color);
        setIsEditing(true);
    };

    const toggleVehicleDetails = (vehicleId) => {
        if (selectedVehicleId === vehicleId) {
            setSelectedVehicleId(null);
        } else {
            setSelectedVehicleId(vehicleId);
        }
        setIsEditing(false);
    };

    return (
        <div>
            <h2>Vehicles Management</h2>
            <button onClick={() => { setIsAdding(true); resetForm(); }} className="btn btn-add">New Vehicle</button>

            {isAdding && (
                <form onSubmit={handleAddVehicle}>
                    <input 
                        type="text" 
                        placeholder="Nick Name"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Branch"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        required
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="submit" className="btn btn-save">Add Vehicle</button>
                        <button type="button" onClick={() => { resetForm(); setIsAdding(false); }} className="btn btn-cancel">Cancel</button>
                    </div>
                </form>
            )}

        <ul className="vehicle-list">
            {vehicles.map((vehicle) => (
                <li key={vehicle.id}>
                    <div 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => toggleVehicleDetails(vehicle.id)}
                    >
                        {vehicle.nickName}
                    </div>
                    {selectedVehicleId === vehicle.id && (
                        <div className="vehicle-details">
                            <p>
                                <strong>Nick Name:</strong> {vehicle.nickName}
                            </p>
                            <p>
                                <strong>Branch:</strong> 
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                    />
                                ) : (
                                    vehicle.branch
                                )}
                            </p>
                            <p>
                                <strong>Model:</strong> 
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                    />
                                ) : (
                                    vehicle.model
                                )}
                            </p>
                            <p>
                                <strong>Year:</strong> 
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                    />
                                ) : (
                                    vehicle.year
                                )}  
                            </p>
                            <p>
                                <strong>Color:</strong> 
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                ) : (
                                    vehicle.color
                                )}
                            </p>
                            {isEditing ? (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button onClick={() => handleEditVehicle(selectedVehicleId)} className="btn btn-save">Save</button>
                                    <button onClick={resetForm} className="btn btn-cancel">Cancel</button>
                                </div>
                            ) : (
                                <button onClick={() => handleStartEditing(vehicle)} className="btn btn-edit">Edit</button>
                            )}
                            <button onClick={() => handleDelete(vehicle.id)} className="btn btn-danger">Delete</button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
        </div>
    );
};

export default CustomerVehicles;
  