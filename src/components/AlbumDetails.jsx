import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AlbumDetails = () => {
  const { albumName, artistName } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const url = `http://localhost:3000/api/albums/details/${artistName}/${albumName}`;
        const response = await axios.get(url);

        if (response.status !== 200) {
          setError("Error fetching album details.");
          setLoading(false);
          return;
        }

        const albumData = response.data;
        setAlbumDetails({
          title: albumData.name,
          artist: artistName, 
          description: albumData.bio, 
          tracks: albumData.tracks,
          coverArt: albumData.coverArt,
        });
      } catch (err) {
        setError(`Failed to fetch album details: ${err.message}`);
        console.error("Error fetching album details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [albumName, artistName]);

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
        {loading && <p>Loading album details...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {albumDetails && !loading && !error && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-6">
              <img
                src={albumDetails.coverArt || "https://via.placeholder.com/300"}
                alt={albumDetails.title}
                className="w-full sm:w-1/3 h-64 object-cover rounded-md mb-4 sm:mb-0"
              />
              <div className="sm:flex-1">
                <h2 className="text-2xl font-bold mb-2">{albumDetails.title}</h2>
                <p className="text-lg mb-2">{albumDetails.artist}</p>
                <p className="text-gray-700 text-justify">
                  {albumDetails.description || "No description available."}
                </p>
              </div>
            </div>

            {/* Track List */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Tracks</h3>
              <ul>
                {albumDetails.tracks && albumDetails.tracks.map((track, index) => (
                  <li key={index} className="text-gray-700 mb-2">
                    <span className="font-bold">{index + 1}. </span>
                    <a href={track.url} target="_blank" rel="noopener noreferrer" className="font-bold">
                      {track.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Review Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Reviews</h3>
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

              <div className="mt-4 space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev, index) => (
                    <div key={index} className="p-4 bg-gray-100 rounded-md">
                      <p>{rev}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AlbumDetails;
