// src/components/adminscalendar.js
import React, { useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '../firebase';
import './admincalendar.css';

const AdminCalendar = () => {
  const [hours, setHours] = useState({
    Sunday: { open: '', close: '', isClosed: true },
    Monday: { open: '', close: '', isClosed: false },
    Tuesday: { open: '', close: '', isClosed: false },
    Wednesday: { open: '', close: '', isClosed: false },
    Thursday: { open: '', close: '', isClosed: false },
    Friday: { open: '', close: '', isClosed: false },
    Saturday: { open: '', close: '', isClosed: false },
  });

  useEffect(() => {
    const fetchHours = async () => {
      const hoursRef = ref(database, 'businessHours');
      const snapshot = await get(hoursRef);
      if (snapshot.exists()) {
        setHours(snapshot.val());
      }
    };

    fetchHours();
  }, []);

  const handleChange = (day, field, value) => {
    setHours((prevHours) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day],
        [field]: value,
        isClosed: field === 'open' && !value ? true : prevHours[day].isClosed,
      },
    }));
  };

  const handleClosedToggle = (day) => {
    setHours((prevHours) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day],
        isClosed: !prevHours[day].isClosed,
        open: prevHours[day].isClosed ? '' : prevHours[day].open,
        close: prevHours[day].isClosed ? '' : prevHours[day].close,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const hoursRef = ref(database, 'businessHours');
      await set(hoursRef, hours);
      alert('Business hours saved successfully!');
    } catch (error) {
      console.error('Error saving hours:', error);
      alert('Failed to save business hours.');
    }
  };

  return (
    <div className="calendar-container">
      <h2>Set Operating Hours</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(hours).map((day) => (
          <div key={day} className="calendar-day">
            <label>
              <strong>{day}:</strong>
            </label>
            <input
              type="checkbox"
              checked={hours[day].isClosed}
              onChange={() => handleClosedToggle(day)}
            />
            <span>{hours[day].isClosed ? 'Closed' : 'Open'}</span>

            {!hours[day].isClosed && (
              <div className="time-inputs">
                <input
                  type="time"
                  value={hours[day].open}
                  onChange={(e) => handleChange(day, 'open', e.target.value)}
                  required={!hours[day].isClosed}
                />
                <span>to</span>
                <input
                  type="time"
                  value={hours[day].close}
                  onChange={(e) => handleChange(day, 'close', e.target.value)}
                  required={!hours[day].isClosed}
                />
              </div>
            )}
          </div>
        ))}

        <button type="submit" className="btn btn-save">Save Hours</button>
      </form>
    </div>
  );
};

export default AdminCalendar;
 