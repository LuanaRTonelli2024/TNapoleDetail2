// src/components/customerprofile.js
import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase';
import { getDatabase, ref, onValue, set, update, remove } from 'firebase/database';
import './customerprofile.css';

const CustomerProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [nickName, setNickName] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    const db = getDatabase();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const userRef = ref(database, 'customers/' + user.uid);
            const unsubscribeUser = onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setUserData(data);
                    setName(data.name);
                    setPhone(data.phone);
                    setMobile(data.mobile);
                }
                setLoading(false);
            });

            const addressRef = ref(database, `customers/${user.uid}/addresses/`);
            const unsubscribeAddresses = onValue(addressRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const addressesArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key],
                    }));
                    setAddresses(addressesArray);
                } else {
                    setAddresses([]);
                }
            });

            return () => {
                unsubscribeUser();
                unsubscribeAddresses();
            };
        } else {
            setLoading(false);
        }
    }, [db]);

    const handleSaveProfile = async () => {
        const user = auth.currentUser;
        if (user) {
            const userRef = ref(database, 'customers/' + user.uid);
            try {
                await update(userRef, { name, phone, mobile });
                setIsEditing(false);
            } catch (error) {
                console.error('Erro ao atualizar o perfil:', error);
            }
        }
    };

    const resetProfileForm = () => {
        setName(userData?.name || '');
        setPhone(userData?.phone || '');
        setMobile(userData?.mobile || '');
        setIsEditing(false);
    };

    const resetAddressForm = () => {
        setNickName('');
        setAddress('');
        setCity('');
        setPostalCode('');
        setSelectedAddressId(null);
        setIsEditingAddress(false);
        setIsAdding(true);
    };

    const handleDeleteAddress = (addressId) => {
        const addressRef = ref(database, `customers/${auth.currentUser.uid}/addresses/${addressId}`);
        remove(addressRef);
    };

    const handleStartEditing = (address) => {
        setSelectedAddressId(address.id);
        setAddress(address.address);
        setCity(address.city);
        setPostalCode(address.postalCode);
        setNickName(address.nickName);
        setIsEditingAddress(true);
    };

    const handleEditAddress = async () => {
        if (!selectedAddressId) return;

        try {
            const addressRef = ref(database, `customers/${auth.currentUser.uid}/addresses/${selectedAddressId}`);
            await update(addressRef, { address, city, postalCode, nickName });
            resetAddressForm();
        } catch (error) {
            console.error('Error editing address:', error);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        try {
            const user = auth.currentUser;
            if (user) {
                const uid = user.uid;
                const newAddressRef = ref(database, `customers/${uid}/addresses/${Date.now()}`);
                await set(newAddressRef, { address, city, postalCode, nickName });
                resetAddressForm();
            } else {
                console.log("Nenhum usuário logado.");
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const toggleAddressDetails = (addressId) => {
        if (selectedAddressId === addressId) {
            setSelectedAddressId(null);
        } else {
            setSelectedAddressId(addressId);
        }
        setIsEditingAddress(false);
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!userData) {
        return <p>No user data.</p>;
    }

    return (
        <div>
            <h2>User Profile</h2>
            <div className="profile-page">
                <h3>Profile</h3>
                <p><strong>Name:</strong>
                    {isEditing ? (
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    ) : (
                        userData.name
                    )}
                </p>
                <p><strong>Phone:</strong>
                    {isEditing ? (
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    ) : (
                        userData.phone
                    )}
                </p>
                <p><strong>Mobile Phone:</strong>
                    {isEditing ? (
                        <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                    ) : (
                        userData.mobile
                    )}
                </p>
                {isEditing ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button onClick={handleSaveProfile} className="btn btn-save">Save</button>
                        <button onClick={resetProfileForm} className="btn btn-cancel">Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="btn btn-edit">Edit</button>
                )}
            </div>

            <div>
                <h3>Addresses</h3>
                <button onClick={() => { setIsAdding(true); resetAddressForm(); }} className="btn btn-add">New Address</button>

                {isAdding && (
                    <form onSubmit={handleAddAddress}>
                        <input type="text" placeholder="Nick Name" value={nickName} onChange={(e) => setNickName(e.target.value)} required />
                        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                        <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button type="submit" className="btn btn-save">Add Address</button>
                            <button type="button" onClick={resetAddressForm} className="btn btn-cancel">Cancel</button>
                        </div>
                    </form>
                )}

                <ul className="address-list">
                    {addresses.map((addressItem) => (
                        <li key={addressItem.id}>
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => toggleAddressDetails(addressItem.id)}
                            >
                                {addressItem.nickName}
                            </div>
                            {selectedAddressId === addressItem.id && (
                                isEditingAddress ? (
                                    <div className="address-details">
                                        <p><strong>Address:</strong>
                                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                                        </p>
                                        <p><strong>City:</strong>
                                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                                        </p>
                                        <p><strong>Postal Code:</strong>
                                            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                            <button onClick={handleEditAddress} className="btn btn-save">Save</button>
                                            <button onClick={resetAddressForm} className="btn btn-cancel">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p><strong>Address:</strong> {addressItem.address}</p>
                                        <p><strong>City:</strong> {addressItem.city}</p>
                                        <p><strong>Postal Code:</strong> {addressItem.postalCode}</p>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                            <button onClick={() => handleStartEditing(addressItem)} className="btn btn-edit">Edit</button>
                                            <button onClick={() => handleDeleteAddress(addressItem.id)} className="btn btn-danger">Delete</button>
                                        </div>
                                    </div>
                                )
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CustomerProfile;
