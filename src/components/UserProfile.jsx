import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const UserProfile = () => {
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://geet-backend.onrender.com/api/reviews/user/${username}`
        );
        const { user, reviews } = response.data;
        setUserDetails(user);
        setReviews(reviews);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handleAlbumClick = (artistName, albumName, albumId) => {
    // Navigate to the album details page
    navigate(`/albums/${artistName}/${albumName}/${albumId}`);
  };

  return (
    <>
      <Navbar />
      <br />
      <div className="max-w-4xl mx-auto my-8 p-4 border rounded-lg shadow-lg">
        {loading ? (
          <p>Loading user data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* User Profile Header */}
            <div className="flex items-center mb-4">
              <img
                src={userDetails.profilePicture || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold">{userDetails.username}</h2>
                <p className="text-gray-600">{userDetails.bio || "No bio available."}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <h3 className="text-xl font-semibold mb-4">Reviews by {userDetails.username}</h3>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 bg-gray-100 rounded-md mb-2 cursor-pointer hover:bg-gray-200"
                  onClick={() =>
                    handleAlbumClick(
                      review.artistName,
                      review.albumName,
                      review.album
                    )
                  }
                >
                  <p className="font-bold">
                    Album:{" "}
                    <Link
                      to={`/albums/${review.artistName}/${review.albumName}/${review.album}`}
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()} // Prevent card click
                    >
                      {review.albumName || "Unknown Album"}
                    </Link>
                  </p>
                  <p>Artist: {review.artistName || "Unknown Artist"}</p>
                  <p>Rating: {review.rating}</p>
                  <p>{review.reviewText}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </>
        )}
      </div>
      <br />
      <Footer />
    </>
  );
};

export default UserProfile;
