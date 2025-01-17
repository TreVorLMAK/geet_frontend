import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AlbumDetails = () => {
  const { albumId, artistName } = useParams(); 
  console.log("Album ID:", albumId);
  console.log("Artist Name:", artistName);
  
  const [albumDetails, setAlbumDetails] = useState(null);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  // Fetch album details from Last.fm API
  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const apiKey = import.meta.env.VITE_APP_LASTFM_API_KEY;

        // Encode parameters to ensure proper URL formatting
        const encodedAlbumId = encodeURIComponent(albumId);
        const encodedArtistName = encodeURIComponent(artistName);

        const response = await axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${encodedArtistName}&album=${encodedAlbumId}&format=json`
        );

        // Check if the album was found
        if (response.data.error) {
          setError(response.data.message); // Display error message from API
          return;
        }

        setAlbumDetails(response.data.album);
      } catch (error) {
        setError("Failed to fetch album details.");
        console.error("Error fetching album details:", error);
      } finally {
        setLoading(false); // Set loading to false after the fetch
      }
    };

    fetchAlbumDetails();
  }, [albumId, artistName]); // Run the effect when the params change

  // Handle review submission
  const handleReviewSubmit = () => {
    if (review.trim()) {
      setReviews([...reviews, review]);
      setReview("");
    }
  };

  return (
    <> 
    <Navbar />
    <br />
    <div className="max-w-4xl mx-auto my-8 p-4 border rounded-lg shadow-lg">
      {/* Show loading state */}
      {loading && <p>Loading album details...</p>}
      
      {/* Show error message if fetch fails */}
      {error && <p>{error}</p>}

      {/* Display album details once loaded */}
      {albumDetails && !loading && !error && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-6">
          <img
            src={albumDetails.image[3]["#text"]}
            alt={albumDetails.name}
            className="w-full sm:w-1/3 h-64 object-cover rounded-md mb-4 sm:mb-0"
          />
          <div className="sm:flex-1">
            <h2 className="text-2xl font-bold mb-2">{albumDetails.name}</h2>
            <p className="text-lg mb-2">{albumDetails.artist.name}</p>
            <p className="text-gray-700">
              {albumDetails.wiki ? albumDetails.wiki.summary : "No description available"}
            </p>
          </div>
        </div>
      )}

      {/* Review Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Reviews</h3>
        <div className="mb-4">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full h-32 p-2 border rounded-md mb-2"
          />
          <button
            onClick={handleReviewSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit Review
          </button>
        </div>

        {/* Display Reviews */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-md">
                <p>{rev}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
    <br />
    <Footer />
    </>
  );
};

export default AlbumDetails;
