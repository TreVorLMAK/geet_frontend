import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Artist = () => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]); // For filtered results
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get('https://geet-backend.onrender.com/api/artists'); // Fetch artists
        setArtists(response.data);
        setFilteredArtists(response.data); // Initialize filtered list
      } catch (err) {
        setError('Failed to fetch artists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // Filter artists when searchQuery changes
  useEffect(() => {
    const results = artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArtists(results);
  }, [searchQuery, artists]);

  if (loading) {
    return <div className="text-center mt-10">Loading artists...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <br />
      <div className="max-w-6xl mx-auto mt-10 p-4 bg-white shadow rounded">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Artist List</h1>
          <button
            onClick={() => navigate('/add')}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Add Artist
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artists by name..."
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {filteredArtists.length === 0 ? (
          <p className="text-gray-500">No artists match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredArtists.map((artist) => (
              <div
                key={artist._id}
                className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-gray-200 transition"
                onClick={() => navigate(`/artist/${artist.name}`)} // Navigate to the artist details page
              >
                <img
                  src={artist.image || 'https://via.placeholder.com/150'}
                  alt={artist.name}
                  className="h-24 w-24 rounded-full object-cover mb-4"
                />
                <div className="text-center w-full">
                  <h2 className="font-bold text-lg truncate">{artist.name}</h2>
                  <p className="text-gray-500 text-sm">{artist.listeners} listeners</p>
                  <p className="text-sm text-gray-600 truncate">{artist.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <br />
      <Footer />
    </>
  );
};

export default Artist;
