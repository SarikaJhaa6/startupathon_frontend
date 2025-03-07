import React, { useState, useEffect } from 'react';
import AdminSidebar from '../pages/AdminSidebar';
import './CompletersManagement.css';
import NoDataIllustration from '../assets/images/NoDataill.png';
import axios from 'axios'; // Import axios for API calls
import { ToastContainer, toast } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function CompletersManagement() {
  const [completers, setCompleters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalStatus, setOriginalStatus] = useState(''); // Track the original status
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    completerName: '',
    businessName: '',
    role: '',
    initialFunding: '',
    description: '',
    status: 'Select Status'
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // To handle form submission state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false); // To handle status dialog visibility
  const [completerIdToUpdate, setCompleterIdToUpdate] = useState(null); // To store completer ID to update
  const [newStatus, setNewStatus] = useState(''); // To store new selected status for confirmation

  const openForm = () => setShowForm(true);
  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };
  const resetForm = () => {
    setFormData({ completerName: '', businessName: '', role: '', initialFunding: '', description: '', status: 'Select Status' });
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch completers from the server
  useEffect(() => {
    setLoading(true); // Set loading to true before API call
    axios.get('http://localhost:5000/api/completers/get-completers')
      .then(response => {
        setCompleters(response.data); // Set fetched completers data
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(error => {
        console.error('Error fetching completers:', error);
        setLoading(false); // Set loading to false even if there's an error
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true

    // Make the API call to add a new completer
    axios.post('http://localhost:5000/api/completers/add-completer', formData)
      .then((response) => {
        if (response.data.success) {
          // Notify user of success
          toast.success('Completer added successfully!');
          closeForm(); // Close the form
          fetchCompleters(); // Refetch completers
          resetForm(); // Reset the form fields
        } else {
          // Notify user of error
          toast.error('Failed to add completer. Please try again.');
        }
        setIsSubmitting(false); // Reset the submitting state
      })
      .catch((error) => {
        console.error('Error adding completer:', error);
        toast.error('An error occurred while adding the completer.');
        setIsSubmitting(false); // Reset the submitting state
      });
  };

  // Function to fetch completers again after adding a new one
  const fetchCompleters = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/completers/get-completers')
      .then(response => {
        setCompleters(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching completers:', error);
        setLoading(false);
      });
  };

  const handleStatusChange = (id, status) => {
    // Find the completer by ID to store the original status before any changes
    const completer = completers.find(completer => completer.id === id);
    if (completer) {
      setOriginalStatus(completer.status); // Store the original status
    }
    
    setCompleterIdToUpdate(id);
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    // Make the PUT request to update the status
    axios.put(`http://localhost:5000/api/completers/status/${completerIdToUpdate}`, { status: newStatus })
      .then((response) => {
        if (response.data.success) {
          toast.success('Completer status updated successfully!');
          fetchCompleters(); // Refetch completers to get the updated status
        } else {
          toast.error('Failed to update completer status.');
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
    // Revert the completer status to its original value if the user cancels
    setCompleters(completers.map(completer =>
      completer.id === completerIdToUpdate ? { ...completer, status: originalStatus } : completer
    ));
    setStatusDialogOpen(false); // Close the status change dialog
  };

  const handleStatusDropdownChange = (e, id) => {
    const selectedStatus = e.target.value;
    // Update the completer's status in the table temporarily until confirmed
    setCompleters(completers.map(completer =>
      completer.id === id ? { ...completer, status: selectedStatus } : completer
    ));
    handleStatusChange(id, selectedStatus);
  };

  return (
    <AdminSidebar>
      <div className="completers-container">
        <div id="completerHeader">
          <div id="completerTitleText">
            <i className="fa-solid fa-user-check"></i>
            <span>Completers Management</span>
          </div>
          <div id="new-completer-raise">
            <button data-modal-target="#modal" id="new-completer" onClick={openForm}>
              <i className="fa-solid fa-circle-plus" style={{ marginRight: "5px", fontSize: "16px" }}></i> Add Completer
            </button>
          </div>
        </div>

        {showForm && (
          <div className="completers-overlay">
            <div className="completerForm-container">
              <div className="completerForm-header">
                <h3>Add Completer</h3>
                <button className="completerForm-close-btn" onClick={closeForm}>&times;</button>
              </div>
              <form id="addCompleterForm" onSubmit={handleSubmit}>
                <div className="completerForm-row">
                  <div className="completerForm-group">
                    <label htmlFor="addcompleter-name">Completer Name</label>
                    <input
                      type="text"
                      id="addcompleter-name"
                      name="completerName"
                      placeholder="Enter completer name"
                      value={formData.completerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="completerForm-group">
                    <label htmlFor="addcompleter-business">Business Name</label>
                    <input
                      type="text"
                      id="addcompleter-business"
                      name="businessName"
                      placeholder="Enter business name"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="completerForm-row">
                  <div className="completerForm-group">
                    <label htmlFor="addcompleter-role">Role</label>
                    <input
                      type="text"
                      id="addcompleter-role"
                      name="role"
                      placeholder="Enter role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="completerForm-group">
                    <label htmlFor="addcompleter-funding">Initial Funding</label>
                    <input
                      type="text"
                      id="addcompleter-funding"
                      name="initialFunding"
                      placeholder="Enter initial funding"
                      value={formData.initialFunding}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="completerForm-group">
                  <label htmlFor="addcompleter-description">Description</label>
                  <textarea
                    id="addcompleter-description"
                    name="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="completerForm-row">
                  <div className="completerForm-group">
                    <label htmlFor="addcompleter-status">Status</label>
                    <select id="addcompleter-status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Select Status" disabled>Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="completerForm-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="completers-table-wrapper">
          {loading ? <div className="spinner"></div> : null}
          <table className="completers-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Completer Name</th>
                <th>Business Name</th>
                <th>Role</th>
                <th>Initial Funding</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {completers.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="no-data-container">
                      <img src={NoDataIllustration} alt="No Data Found" className="no-data-image" />
                      <p>No completers available at the moment.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                completers.map((completer) => (
                  <tr key={completer.id}>
                    <td>{completer.id}</td>
                    <td>{completer.name}</td>
                    <td>{completer.businessname}</td>
                    <td>{completer.role}</td>
                    <td className="completer-description" title={completer.descr}>
                        {completer.descr}
                    </td>      
                    <td>{completer.initfunding}</td>             
                    <td>
                      <select
                        id='trSelect'
                        value={completer.status}
                        onChange={(e) => handleStatusDropdownChange(e, completer.id)}
                        style={{
                          backgroundColor: completer.status === 'Active' ? '#d4edda' : '#F8F4D7FF', // Green for "Active", Red for "Inactive"
                          color: completer.status === 'Active' ? 'green' : '#957C00FF',  // Text color
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
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

export default CompletersManagement;