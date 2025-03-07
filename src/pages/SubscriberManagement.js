import React, { useState, useEffect } from "react";
import AdminSidebar from "../pages/AdminSidebar";
import "./SubscriberManagement.css";
import NoDataIllustration from "../assets/images/NoDataill.png";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SubscriberManagement() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to format date like "5th April, 2025"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    // Add ordinal suffix (st, nd, rd, th)
    const suffix = ["th", "st", "nd", "rd"][
      day % 10 > 3 || (day > 10 && day < 20) ? 0 : day % 10
    ];

    return `${day}${suffix} ${month}, ${year}`;
  };

  // Fetch subscribers from the server
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/subscribers/get-subscribers")
      .then((response) => {
        console.log(response.data); // Debugging API response
        setSubscribers(Array.isArray(response.data.subscribers) ? response.data.subscribers : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subscribers:", error);
        setLoading(false);
      });
  }, []);

  return (
    <AdminSidebar>
      <div className="subscribers-container">
        <div id="subscriberHeader">
          <div id="subscriberTitleText">
            <i className="fa-solid fa-users"></i>
            <span>Subscriber Management</span>
          </div>
        </div>

        <div className="subscribers-table-wrapper">
          {loading && <div className="spinner"></div>}
          <table className="subscribers-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscription Date</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan="2">
                    <div className="no-data-container">
                      <img src={NoDataIllustration} alt="No Data Found" className="no-data-image" />
                      <p>No subscribers available at the moment.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber._id}>
                    <td>{subscriber.email}</td>
                    <td>{formatDate(subscriber.updated_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ToastContainer />
      </div>
    </AdminSidebar>
  );
}

export default SubscriberManagement;
