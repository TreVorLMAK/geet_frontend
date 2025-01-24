import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ConfirmationModal from "./ConfirmationModal"; // Import the modal

const AlbumDetails = () => {
  const { albumName, artistName } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [editReviewId, setEditReviewId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedReviewId, setSelectedReviewId] = useState(null); // Store selected review ID for confirmation

  const username = localStorage.getItem("username") || "guest";

  // Fetch album details and reviews
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
          mbid: albumData.id,
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

  useEffect(() => {
    if (albumDetails?.mbid) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/reviews/album/${albumDetails.mbid}`
          );
          setReviews(response.data.reviews);
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      };

      fetchReviews();
    }
  }, [albumDetails]);

  const handleReviewSubmit = async () => {
    if (!review.trim() || rating <= 0 || !albumDetails?.mbid) {
      alert("Please provide a review, rating, and album ID.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to submit a review.");
        return;
      }

      const newReview = {
        albumId: albumDetails.mbid,
        rating,
        reviewText: review,
      };

      const response = await axios.post(
        "http://localhost:3000/api/reviews",
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews([...reviews, response.data.review]);
      setReview("");
      setRating(0);
    } catch (err) {
      console.error("Error posting review:", err);
    }
  };

  const handleDeleteReview = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to delete a review.");
        return;
      }

      await axios.delete(
        `http://localhost:3000/api/reviews/${selectedReviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(reviews.filter((rev) => rev._id !== selectedReviewId));
      setIsModalOpen(false); // Close the modal after deletion
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete the review. Please try again.");
    }
  };

  const handleEditReview = (id, currentReview, currentRating) => {
    setEditReviewId(id);
    setReview(currentReview);
    setRating(currentRating);
  };

  const handleUpdateReview = async () => {
    if (!review.trim() || rating <= 0) {
      alert("Please provide a review and a rating.");
      return;
    }

    try {
      const updatedReview = { reviewText: review, rating };
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:3000/api/reviews/${editReviewId}`,
        updatedReview,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(
        reviews.map((rev) =>
          rev._id === editReviewId ? { ...rev, ...response.data.review } : rev
        )
      );

      setEditReviewId(null);
      setReview("");
      setRating(0);
    } catch (err) {
      console.error("Error updating review:", err);
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
            {/* Album Details */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-6">
              <img
                src={albumDetails.coverArt || "https://via.placeholder.com/300"}
                alt={albumDetails.title}
                className="w-full sm:w-1/3 h-64 object-cover rounded-md mb-4 sm:mb-0"
              />
              <div className="sm:flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {albumDetails.title}
                </h2>
                <p className="text-lg mb-2">{albumDetails.artist}</p>
                <p className="text-gray-700 text-justify">
                  {albumDetails.description || "No description available."}
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Reviews</h3>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review..."
                className="w-full h-32 p-2 border rounded-md mb-2"
              />
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full p-2 border rounded-md mb-2"
              >
                <option value={0} disabled>
                  Select Rating (0-5)
                </option>
                {[...Array(6)].map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>

              <button
                onClick={editReviewId ? handleUpdateReview : handleReviewSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {editReviewId ? "Update Review" : "Submit Review"}
              </button>

              <div className="mt-4 space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 bg-gray-100 rounded-md flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-blue-400">
                          <Link
                            to={`/Profile/${rev.username}`}
                            className="hover:underline"
                          >
                            {rev.username}
                          </Link>
                        </p>
                        <p>Rating: {rev.rating}</p>
                        <p>{rev.reviewText}</p>
                      </div>
                      {rev.username === username && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleEditReview(
                                rev._id,
                                rev.reviewText,
                                rev.rating
                              )
                            }
                            className="text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedReviewId(rev._id); // Set the selected review for deletion
                              setIsModalOpen(true); // Open the modal
                            }}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
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

      {/* Confirmation Modal */}
      {isModalOpen && (
        <ConfirmationModal
          onCancel={() => setIsModalOpen(false)} // Close modal on cancel
          onConfirm={handleDeleteReview} // Confirm delete action
          message="Are you sure you want to delete this review?"
        />
      )}

      <Footer />
    </>
  );
};

export default AlbumDetails;
