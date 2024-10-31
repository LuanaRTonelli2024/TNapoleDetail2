import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase'; // Import Firebase auth and database
import { ref, onValue } from 'firebase/database'; // Import necessary methods
import './profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const userRef = ref(database, 'customers/' + user.uid);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setUserData(data);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!userData) {
        return <p>No user data available.</p>;
    }

    return (
        <div className="profile-page">
            <h2>User Profile</h2>
            <p><strong>Full Name:</strong> {userData.fullName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Address:</strong> {userData.address}</p>
            <p><strong>Neighborhood:</strong> {userData.neighborhood}</p>
            <p><strong>Postal Code:</strong> {userData.postalCode}</p>
            <p><strong>City:</strong> {userData.city}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
            <p><strong>Mobile:</strong> {userData.mobile}</p>
        </div>
    );
};

export default Profile;
