import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AddArtist = () => {
  const [artistName, setArtistName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (name) => {
    setArtistName(name);
    if (name.length > 2) {
      try {
        const apiKey = import.meta.env.VITE_APP_LASTFM_API_KEY;
        const response = await axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${name}&api_key=${apiKey}&format=json`
        );
        const artistSuggestions = response.data.results.artistmatches.artist;
        setSuggestions(artistSuggestions.slice(0, 5)); // Show top 5 suggestions
      } catch (err) {
        console.error('Error fetching artist suggestions:', err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (artist) => {
    setArtistName(artist.name);
    setSelectedArtist(artist);
    setSuggestions([]); // Clear suggestions after selection
  };

const handleAddArtist = async () => {
  if (!selectedArtist) {
    setError('Please select an artist from the suggestions.');
    return;
  }

  const artistData = {
    name: selectedArtist.name,
    image: selectedArtist.image?.[2]?.['#text'] || '',
    listeners: selectedArtist.listeners || 0,
    playcount: selectedArtist.playcount || 0,
    bio: 'Artist biography not available from suggestions.',
    mbid: selectedArtist.mbid || null,
  };

  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const response = await axios.post('https://geet-backend.onrender.com/api/artists/add', artistData);

    console.log('Artist added response:', response.data);

    setSuccess('Artist added successfully!');
    setArtistName('');
    setSuggestions([]);
    setSelectedArtist(null);

    navigate('/artist');
  } catch (err) {
    console.error('Error adding artist:', err);
    const errorMessage = err.response?.data?.error || 'Failed to add artist. Please try again later.';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
  
  return (
    <>
      <Navbar />
      <br />
      <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Add Artist</h1>

        {/* Input for artist name */}
        <div className="relative mb-4">
          <input
            type="text"
            value={artistName}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for an artist..."
            className="w-full px-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border mt-1 w-full rounded shadow">
              {suggestions.map((artist, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelect(artist)}
                >
                  <div className="flex items-center">
                    {/* Artist Image */}
                    {artist.image && artist.image[2] && (
                      <img
                        src={artist.image[2]['#text']}
                        alt={artist.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    )}
                    <span>{artist.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Error or Success Messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {/* Add Artist Button */}
        <button
          onClick={handleAddArtist}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Artist
        </button>
      </div>
      <br />
      <Footer />
    </>
  );
};

export default AddArtist;
