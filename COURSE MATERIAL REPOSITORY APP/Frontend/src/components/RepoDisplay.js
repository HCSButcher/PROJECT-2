import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RepoDisplay = () => {
  const { unitId } = useParams(); // Get the unit ID from the URL
  const [notes, setNotes] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

 useEffect(() => {
    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.warn("No token found. User might not be authenticated.");
                return;
            }

            const response = await fetch(`http://localhost:3001/notes/${unitId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Response Status:", response.status);
            if (!response.ok) {
                throw new Error(`Failed to fetch notes. Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response Data:", data);

            if (data && Array.isArray(data.notes) && data.notes.length > 0) {
                setNotes(data.notes[0].filePath);
                setName(data.notes[0].unit || '');
            } else {
                console.warn("No notes found for this unit.");
                setError("No notes available for this unit.");
            }
        } catch (err) {
            console.error("Error fetching notes:", err);
            setError("Unable to fetch notes for this unit.");
        }
    };

    fetchNotes();
}, [unitId]);


  const handleDownload = (filePath) => {
    try {
      console.log('Downloading file from:', filePath);
      window.location.href = `http://localhost:3001/download/${encodeURIComponent(filePath)}`;
    } catch (error) {
      console.error('Error initiating download:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
  <h1 style={{ fontSize: '20px', marginBottom: '10px', color: '#333', textAlign: 'left' }}>
    Materials for {name} ({unitId})
  </h1>
  {error && <p style={{ color: 'red', marginBottom: '10px', textAlign: 'left' }}>{error}</p>}
  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
    {notes.length > 0 ? (
      notes.map((note, index) => (
        <li
          key={index}
          style={{
            marginBottom: '10px',
            display: 'block', // Ensures each item spans full width
          }}
        >
          <button
            onClick={() => handleDownload(note.filePath)}
            style={{
              textDecoration: 'none',
              color: '#007BFF',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              textAlign: 'left', // Aligns button text to the left
              display: 'block', // Makes button take full width of its container
            }}
          >
            {note.unitName}
          </button>
        </li>
      ))
    ) : (
      <p style={{ color: '#555', fontSize: '14px', textAlign: 'left' }}>
        No notes available for this unit.
      </p>
    )}
  </ul>
</div>


  );
};

export default RepoDisplay;
