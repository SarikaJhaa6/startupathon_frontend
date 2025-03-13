import React, { useState, useEffect } from 'react';
import AdminSidebar from '../pages/AdminSidebar';
import './ChallengesManagement.css';
import NoDataIllustration from '../assets/images/NoDataill.png';
import axios from 'axios'; // Import axios for API calls
import { ToastContainer, toast } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function ChallengesManagement() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalStatus, setOriginalStatus] = useState(''); // Track the original status
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    funding: '',
    description: '',
    deadline: '',
    status: 'Select Status'
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // To handle form submission state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false); // To handle status dialog visibility
  const [challengeIdToUpdate, setChallengeIdToUpdate] = useState(null); // To store challenge ID to update
  const [newStatus, setNewStatus] = useState(''); // To store new selected status for confirmation
  const [attachment, setAttachment] = useState(null);

  const openForm = () => setShowForm(true);
  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };
  const resetForm = () => {
    setFormData({ title: '', funding: '', description: '', deadline: '', status: 'Select Status' });
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  // Fetch challenges from the server
  //  useEffect(() => {
  //   setLoading(true); // Set loading to true before API call
  //   axios.get('http://localhost:5000/api/challenges/get-challenges')
  //     .then(response => {
  //       setChallenges(response.data); // Set fetched challenges data
  //       setLoading(false); // Set loading to false once data is fetched
  //     })
  //     .catch(error => {
  //       console.error('Error fetching challenges:', error);
  //       setLoading(false); // Set loading to false even if there's an error
  //     });
  // }, []);

  // Fetch challenges from the server
  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true); // Set loading to true before API call
      try {
        const response = await axios.get('https://startupathonbackend-production.up.railway.app/api/challenges/get-challenges');
        setChallenges(response.data); // Set fetched challenges data
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched or if there's an error
      }
    };
  
    fetchChallenges(); // Call the function to fetch challenges
  }, []);
  
  function formatDateWithSuffix(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    
    // Determine the suffix for the day
    const suffix = (day) => {
      if (day > 3 && day < 21) return 'th'; // Handle 11th, 12th, 13th, etc.
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    // Get full date in the desired format
    const dayWithSuffix = day + suffix(day);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    return `${dayWithSuffix} ${month} ${year}`;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('funding', formData.funding);
    formDataObj.append('description', formData.description);
    formDataObj.append('deadline', formData.deadline);
    formDataObj.append('status', formData.status);
    if (attachment) {
      formDataObj.append('image', attachment);
    }
  
    try {

      // const response = await axios.post('http://localhost:5000/api/challenges/add-challenge', formDataObj, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });

      const response = await axios.post(
        'https://startupathonbackend-production.up.railway.app/api/challenges/add-challenge', // Updated URL
        formDataObj,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      if (response.data.success) {
        toast.success('Challenge added successfully!');
        closeForm();
        fetchChallenges();
        resetForm();
      } else {
        toast.error('Failed to add challenge.');
      }
    } catch (error) {
      console.error('Error adding challenge:', error);
      toast.error('Error while adding challenge.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const fetchChallenges = () => {
    setLoading(true);
    // axios.get('http://localhost:5000/api/challenges/get-challenges')

    axios.get('https://startupathonbackend-production.up.railway.app/api/challenges/get-challenges')
      .then(response => {
        setChallenges(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching challenges:', error);
        setLoading(false);
      });
  };
  
  const handleStatusChange = (id, status) => {
    console.log("ID being passed:", id);  // Check if ID is being passed correctly
    
    const challenge = challenges.find(challenge => challenge._id === id);
    if (challenge) {
      setOriginalStatus(challenge.status); // Store the original status
    }
  
    setChallengeIdToUpdate(id);
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    // Make the PUT request to update the status
    // axios.put(`http://localhost:5000/api/challenges/status/${challengeIdToUpdate}`, { status: newStatus })

    axios.put(`https://startupathonbackend-production.up.railway.app/api/challenges/status/${challengeIdToUpdate}`, { status: newStatus })
      .then((response) => {
        if (response.data.success) {
          toast.success('Challenge status updated successfully!');
          fetchChallenges(); // Refetch challenges to get the updated status
        } else {
          toast.error('Failed to update challenge status.');
        }
        setStatusDialogOpen(false);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        toast.error('An error occurred while updating the status.');
        setStatusDialogOpen(false);
      });
  };
  
  const cancelStatusChange = () => {
    // Revert the challenge status to its original value if the user cancels
    setChallenges(challenges.map(challenge =>
      challenge._id === challengeIdToUpdate ? { ...challenge, status: originalStatus } : challenge
    ));
    setStatusDialogOpen(false); // Close the status change dialog
  };

  const handleStatusDropdownChange = (e, id) => {
    const selectedStatus = e.target.value;
    // Update the challenge's status in the table temporarily until confirmed
    setChallenges(challenges.map(challenge =>
      challenge._id === id ? { ...challenge, status: selectedStatus } : challenge
    ));
    handleStatusChange(id, selectedStatus);
  };

  return (
    <AdminSidebar>
      <div className="challenges-container">
        <div id="challengeHeader">
          <div id="challengeTitleText">
            <i className="fa-solid fa-trophy"></i>
            <span>Challenges Management</span>
          </div>
          <div id="new-challenge-raise">
            <button data-modal-target="#modal" id="new-challenge" onClick={openForm}>
              <i className="fa-solid fa-circle-plus" style={{ marginRight: "5px", fontSize: "16px" }}></i> Add Challenge
            </button>
          </div>
        </div>

        {showForm && (
          <div className="challenges-overlay">
            <div className="challengeForm-container">
              <div className="challengeForm-header">
                <h3>Add Challenge</h3>
                <button className="challengeForm-close-btn" onClick={closeForm}>&times;</button>
              </div>
              <form id="addChallengeForm" onSubmit={handleSubmit}>
                <div className="challengeForm-row">
                  <div className="challengeForm-group">
                    <label htmlFor="addchallenge-title">Title</label>
                    <input
                      type="text"
                      id="addchallenge-title"
                      name="title"
                      placeholder="Enter title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="challengeForm-group">
                    <label htmlFor="addchallenge-funding">Funding ($)</label>
                    <input
                      type="text"
                      id="addchallenge-funding"
                      name="funding"
                      placeholder="Enter funding amount"
                      value={formData.funding}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="challengeForm-group">
                  <label htmlFor="addchallenge-description">Description</label>
                  <textarea
                    id="addchallenge-description"
                    name="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="challengeForm-row">
                  <div className="challengeForm-group">
                    <label htmlFor="addchallenge-deadline">Deadline</label>
                    <input
                      type="date"
                      id="addchallenge-deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="challengeForm-group">
                    <label htmlFor="addchallenge-status">Status</label>
                    <select
                      id="addchallenge-status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Select Status" disabled>Select Status</option>
                      <option value="display">Display</option>
                      <option value="hide">Hide</option>
                    </select>
                  </div>
                </div>
                <div className="challengeForm-group">
  <label htmlFor="addchallenge-attachment">Attachment</label>
  <input
    type="file"
    id="addchallenge-attachment"
    accept="image/*, application/pdf"
    onChange={(e) => setAttachment(e.target.files[0])}
  />
</div>

                <button type="submit" className="challengeForm-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="challenges-table-wrapper">
          {loading ? <div className="spinner"></div> : null}
          <table className="challenges-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Funding ($)</th>
                <th>Deadline</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {challenges.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="no-data-container">
                      <img src={NoDataIllustration} alt="No Data Found" className="no-data-image" />
                      <p>No challenges available at the moment.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                challenges.map((challenge) => (
                  <tr key={challenge._id}>
                    <td>{challenge.title}</td>
                    <td>${challenge.funding}</td>
                    <td>{formatDateWithSuffix(challenge.deadline)}</td>
                    <td title={challenge.description}>
                      {challenge.description.length > 50 ? `${challenge.description.slice(0, 50)}...` : challenge.description}
                    </td>
                    <td>
      {/* Dropdown for status */}
      <select
        id='trSelect'
        value={challenge.status}
        onChange={(e) => handleStatusDropdownChange(e, challenge._id)}
        style={{
          backgroundColor: challenge.status === 'display' ? '#d4edda' : '#F8F4D7FF', // Green for "Display", Red for "Hide"
          color: challenge.status === 'display' ? 'green' : '#957C00FF',  // Text color
        }}
      >
        <option value="display">Visible</option>
        <option value="hide">Hidden</option>
      </select>
    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Status Change Confirmation Dialog */}
        {statusDialogOpen && (
            <div className="overlayConfirmation">
                <div className="status-confirmation-dialog">
                <div className="status-dialog-content">
                    <p>Are you sure you want to update the status to {newStatus}?</p>
                    <div className="status-dialog-actions">
                    <button onClick={confirmStatusChange}>Update</button>
                    <button onClick={cancelStatusChange}>Cancel</button>
                    </div>
                </div>
                </div>
            </div>
            )}


        {/* Toast container to show success/error messages */}
        <ToastContainer />
      </div>
    </AdminSidebar>
  );
}

export default ChallengesManagement;
