import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import Footer from './Footer';
import Navbar from './Navbar';

const ArtistDetail = () => {
  const { artistName } = useParams(); // Extract artist name from the URL
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        // Fetch artist details 
        const artistResponse = await axios.get(`http://localhost:3000/api/artists/${artistName}`);
        setArtist(artistResponse.data);

        // Fetch albums for the artist
        const albumResponse = await axios.get(`http://localhost:3000/api/albums/fetch/${artistName}`);
        setAlbums(albumResponse.data.albums);
      } catch (err) {
        console.error('Error fetching artist details or albums', err);
      }
    };

    fetchArtistData();
  }, [artistName]);

  if (!artist) {
    return <div>Loading...</div>;
  }

  // Handle click on album
  const handleAlbumClick = (albumId) => {
    // Redirect to the album details page
    navigate(`/albums/${artistName}/${albumId}`);
  };

  return (
    <>
      <Navbar />
      <br />
      <div className="max-w-6xl mx-auto mt-10 p-4">
        <h1 className="text-3xl sm:text-4xl font-bold">{artist.name}</h1>
        <p className="mt-4 text-lg sm:text-xl">{artist.bio}</p>

        <div className="mt-10">
          <h2 className="text-2xl sm:text-3xl font-semibold">Albums</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {albums.map((album) => (
              <div
                key={album.mbid}
                className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleAlbumClick(album.mbid)} // Handle album click
              >
                <img 
                  src={album.image[2]['#text']} 
                  alt={album.name} 
                  className="w-full h-48 sm:h-56 md:h-64 object-cover mb-4 rounded-md" 
                />
                <h3 className="text-xl sm:text-2xl font-bold text-center">{album.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
};

export default ArtistDetail;
