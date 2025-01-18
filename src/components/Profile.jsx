import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Retrieve the token from localStorage (or wherever you're storing it)
    const token = localStorage.getItem('token'); // Adjust based on your storage mechanism

    if (!token) {
      // Handle the case where the token is missing (e.g., show a login prompt)
      console.error('No token found');
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch('http://localhost:3000/api/user/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch user reviews
    const fetchUserReviews = async () => {
      try {
        const reviewsResponse = await fetch('http://localhost:3000/api/reviews/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here as well
          },
        });

        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchUserData();
    fetchUserReviews();
  }, []); 

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <br />
      <div className="max-w-screen-xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* User Details */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-purple-700">User Info</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              <strong>Name:</strong> {user.data.username}
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> {user.data.email}
            </p>
          </div>

          {/* User Reviews */}
          <div>
            <h2 className="text-2xl font-semibold text-purple-700">Reviewed Albums</h2>
            {reviews.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <li key={review.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {review.albumName}
                    </h3>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      <strong>Artist:</strong> {review.artist}
                    </p>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      <strong>Your Review:</strong> {review.reviewText}
                    </p>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      <strong>Rating:</strong> {review.rating} / 5
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                You haven’t reviewed any albums yet.
              </p>
            )}
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
};

export default Profile;
