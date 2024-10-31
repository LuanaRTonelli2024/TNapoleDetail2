//src/components/vehicles.js
import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        name: '',
        brand: '',
        model: '',
        year: '',
        color: ''
    });

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const vehiclesRef = ref(database, 'vehicles/' + user.uid);
            onValue(vehiclesRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setVehicles(Object.values(data));
                }
                setLoading(false);
            });
        } else {
            setLoading(false); // User not logged in
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle({ ...newVehicle, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const newVehicleRef = ref(database, `vehicles/${user.uid}/${newVehicle.name}`);
        await set(newVehicleRef, newVehicle);
        setNewVehicle({ name: '', brand: '', model: '', year: '', color: '' });
        setShowForm(false);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Your Vehicles</h2>
            <div className="vehicles-container d-flex flex-wrap">
                {/* Always show the New Vehicle card */}
                <div className="card m-2" style={{ width: '18rem', cursor: 'pointer' }} onClick={() => setShowForm(true)}>
                    <div className="card-body">
                        <h5 className="card-title">New Vehicle</h5>
                    </div>
                </div>
                

                {/* Show existing vehicles if any */}
                {vehicles.map((vehicle, index) => (
                    <div key={index} className="card m-2" style={{ width: '18rem' }}>
                        <div className="card-body">
                            <h5 className="card-title">{vehicle.name}</h5>
                            <h6 className="card-subtitle mb-2 text-body-secondary">{vehicle.brand} {vehicle.model}</h6>
                            <p className="card-text">
                                Year: {vehicle.year} <br />
                                Color: {vehicle.color}
                            </p>
                            <a href="#" className="card-link">View Details</a>
                            <a href="#" className="card-link">Edit</a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Render the form if showForm is true */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <h3>Add New Vehicle</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Vehicle Name"
                        value={newVehicle.name}
                        onChange={handleInputChange}
                        required
                        className="form-control mb-2"
                    />
                    <input
                        type="text"
                        name="brand"
                        placeholder="Brand"
                        value={newVehicle.brand}
                        onChange={handleInputChange}
                        required
                        className="form-control mb-2"
                    />
                    <input
                        type="text"
                        name="model"
                        placeholder="Model"
                        value={newVehicle.model}
                        onChange={handleInputChange}
                        required
                        className="form-control mb-2"
                    />
                    <input
                        type="number"
                        name="year"
                        placeholder="Year"
                        value={newVehicle.year}
                        onChange={handleInputChange}
                        required
                        className="form-control mb-2"
                    />
                    <input
                        type="text"
                        name="color"
                        placeholder="Color"
                        value={newVehicle.color}
                        onChange={handleInputChange}
                        required
                        className="form-control mb-2"
                    />
                    <button type="submit" className="btn btn-primary">Add Vehicle</button>
                </form>
            )}
        </div>
    );
};

export default Vehicles;