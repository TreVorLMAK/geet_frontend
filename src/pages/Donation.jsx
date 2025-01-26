import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Donation = () => {
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    setLoading(true);

    fetch("http://localhost:3000/api/khalti/initiate-donation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        donorName: donorName,
        returnUrl: "http://localhost:5173/complete-donation", // Callback URL after success
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);

        if (data.success) {
          const { paymentUrl } = data;
          window.location.href = paymentUrl; // Redirect to Khalti payment page
        } else {
          alert("Payment initiation failed. Please try again.");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error initiating payment:", error);
        alert("Error initiating payment. Please try again.");
      });
  };

  return (
    <>
      <Navbar />
      <br />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-purple-600 mb-4">
            Support Us with a Donation
          </h1>
          <input
            type="text"
            placeholder="Your Name (Optional)"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Enter Donation Amount (in Rs)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            onClick={handleDonate}
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Donate via Khalti"}
          </button>
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
};

export default Donation;
