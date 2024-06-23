import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false); // Trạng thái để kiểm soát việc hiển thị form chỉnh sửa
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setProfile(response.data);
                setPhoneNumber(response.data.phoneNumber);
                setAddress(response.data.address);
            } catch (error) {
                setError(error.response.data.message);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        fetch(`http://localhost:8080/update/${profile.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ phoneNumber, address }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }
                return response.json();
            })
            .then(data => {
                console.log('Profile updated successfully:', data);
                setProfile(data); // Cập nhật lại thông tin profile trong state
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                // Xử lý lỗi khi cập nhật không thành công
                setError('Failed to update profile');
            });
    };
    const handleEdit = () => {
        setEditMode(true); // Khi nhấn chỉnh sửa, hiển thị form chỉnh sửa
    };

    const handleChangePhoneNumber = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleChangeAddress = (event) => {
        setAddress(event.target.value);
    };

    if (error) {
        return <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>{error}</div>;
    }

    if (!profile) {
        return <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>Loading...</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Profile</h2>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
            <p><strong>Address:</strong> {profile.address}</p>
            {/* Các thông tin khác của profile */}

            {editMode ? (
                <form>
                    <label>
                        Phone Number:
                        <input type="text" value={phoneNumber} onChange={handleChangePhoneNumber} />
                    </label>
                    <br />
                    <label>
                        Address:
                        <input type="text" value={address} onChange={handleChangeAddress} />
                    </label>
                    <br />
                    {/* Các trường nhập liệu khác của profile */}
                    <button type="button" onClick={handleUpdateProfile}>Save</button>
                </form>
            ) : (
                <button onClick={handleEdit}>Edit Profile</button>
            )}
        </div>
    );
};

export default Profile;
