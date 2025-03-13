import React, { useState, useEffect } from 'react'; 
import AdminSidebar from '../pages/AdminSidebar'; 
import './FounderManagement.css'; 
import NoDataIllustration from '../assets/images/NoDataill.png'; 
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

function FounderManagement() { 
  const [founders, setFounders] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [originalStatus, setOriginalStatus] = useState(''); 
  const [showForm, setShowForm] = useState(false); 
  const [formData, setFormData] = useState({ 
    name: '', 
    position: '', 
    company: '', 
    linkedin: '', 
    description: '', 
    status: 'Select Status' 
  }); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [statusDialogOpen, setStatusDialogOpen] = useState(false); 
  const [founderIdToUpdate, setFounderIdToUpdate] = useState(null); 
  const [newStatus, setNewStatus] = useState(''); 

  const openForm = () => setShowForm(true); 
  const closeForm = () => { 
    setShowForm(false); 
    resetForm(); 
  }; 
  const resetForm = () => { 
    setFormData({ 
      name: '', 
      position: '', 
      company: '', 
      linkedin: '', 
      description: '', 
      status: 'Select Status' 
    }); 
  }; 
  const handleChange = (e) => { 
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
  };

  // useEffect(() => { 
  //   setLoading(true); 
  //   axios.get('http://localhost:5000/api/founders/get-founders') 
  //     .then(response => { 
  //       setFounders(response.data); 
  //       setLoading(false); 
  //     }) 
  //     .catch(error => { 
  //       console.error('Error fetching founders:', error); 
  //       setLoading(false); 
  //     }); 
  // }, []);
  useEffect(() => {
    const fetchFounders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://startupathonbackend-production.up.railway.app/api/founders/get-founders'
        );
        setFounders(response.data);
      } catch (error) {
        console.error('Error fetching founders:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFounders();
  }, []);
  
  // const handleSubmit = (e) => { 
  //   e.preventDefault(); 
  //   setIsSubmitting(true); 

  //   axios.post('http://localhost:5000/api/founders/add-founder', formData)
  //     .then((response) => {
  //       if (response.data.success) {
  //         toast.success('Founder added successfully!');
  //         closeForm(); 
  //         fetchFounders(); 
  //         resetForm(); 
  //       } else {
  //         toast.error('Failed to add founder. Please try again.');
  //       }
  //       setIsSubmitting(false); 
  //     })
  //     .catch((error) => {
  //       console.error('Error adding founder:', error);
  //       toast.error('An error occurred while adding the founder.');
  //       setIsSubmitting(false); 
  //     });
  // };

  // const fetchFounders = () => { 
  //   setLoading(true); 
  //   axios.get('http://localhost:5000/api/founders/get-founders') 
  //     .then(response => { 
  //       setFounders(response.data); 
  //       setLoading(false); 
  //     }) 
  //     .catch((error) => { 
  //       console.error('Error fetching founders:', error); 
  //       setLoading(false); 
  //     }); 
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await axios.post(
        'https://startupathonbackend-production.up.railway.app/api/founders/add-founder',
        formData
      );
  
      if (response.data.success) {
        toast.success('Founder added successfully!');
        closeForm(); // Close the form
        await fetchFounders(); // Refetch founders after adding
        resetForm(); // Reset the form fields
      } else {
        toast.error('Failed to add founder. Please try again.');
      }
    } catch (error) {
      console.error('Error adding founder:', error);
      toast.error('An error occurred while adding the founder.');
    } finally {
      setIsSubmitting(false); // Reset the submitting state
    }
  };
  
  const fetchFounders = async () => {
    setLoading(true);
  
    try {
      const response = await axios.get(
        'https://startupathonbackend-production.up.railway.app/api/founders/get-founders'
      );
      setFounders(response.data);
    } catch (error) {
      console.error('Error fetching founders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = (id, status) => { 
    const founder = founders.find(founder => founder.id === id); 
    if (founder) { 
      setOriginalStatus(founder.status); 
    }
    setFounderIdToUpdate(id);
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  // const confirmStatusChange = () => { 
  //   axios.put(`http://localhost:5000/api/founders/status/${founderIdToUpdate}`, { status: newStatus }) 
  //     .then((response) => { 
  //       if (response.data.success) { 
  //         toast.success('Founder status updated successfully!'); 
  //         fetchFounders(); 
  //       } else { 
  //         toast.error('Failed to update founder status.'); 
  //       } 
  //       setStatusDialogOpen(false); 
  //     }) 
  //     .catch((error) => { 
  //       console.error('Error updating status:', error); 
  //       toast.error('An error occurred while updating the status.'); 
  //       setStatusDialogOpen(false); 
  //     }); 
  // };


  const confirmStatusChange = async () => {
    try {
      const response = await axios.put(
        `https://startupathonbackend-production.up.railway.app/api/founders/status/${founderIdToUpdate}`,
        { status: newStatus }
      );
  
      if (response.data.success) {
        toast.success('Founder status updated successfully!');
        await fetchFounders(); // Refetch founders to get the updated status
      } else {
        toast.error('Failed to update founder status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('An error occurred while updating the status.');
    } finally {
      setStatusDialogOpen(false);
    }
  };
  

  const cancelStatusChange = () => { 
    setFounders(founders.map(founder => founder.id === founderIdToUpdate ? { ...founder, status: originalStatus } : founder)); 
    setStatusDialogOpen(false); 
  };

  const handleStatusDropdownChange = (e, id) => { 
    const selectedStatus = e.target.value; 
    setFounders(founders.map(founder => founder.id === id ? { ...founder, status: selectedStatus } : founder)); 
    handleStatusChange(id, selectedStatus); 
  };

  return ( 
    <AdminSidebar> 
      <div className="founders-container"> 
        <div id="founderHeader"> 
          <div id="founderTitleText"> 
            <i className="fa-solid fa-user-tie"></i> 
            <span>Founders Management</span> 
          </div> 
          <div id="new-founder-raise"> 
            <button data-modal-target="#modal" id="new-founder" onClick={openForm}> 
              <i className="fa-solid fa-circle-plus" style={{ marginRight: "5px", fontSize: "16px" }}></i> Add Founder 
            </button> 
          </div> 
        </div>

        {showForm && ( 
          <div className="founders-overlay"> 
            <div className="founderForm-container"> 
              <div className="founderForm-header"> 
                <h3>Add Founder</h3> 
                <button className="founderForm-close-btn" onClick={closeForm}>&times;</button> 
              </div> 
              <form id="addFounderForm" onSubmit={handleSubmit}> 
                <div className="founderForm-row"> 
                  <div className="founderForm-group"> 
                    <label htmlFor="addfounder-name">Name</label> 
                    <input 
                      type="text" 
                      id="addfounder-name" 
                      name="name" 
                      placeholder="Enter founder name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    /> 
                  </div> 
                  <div className="founderForm-group"> 
                    <label htmlFor="addfounder-position">Position</label> 
                    <input 
                      type="text" 
                      id="addfounder-position" 
                      name="position" 
                      placeholder="Enter position" 
                      value={formData.position} 
                      onChange={handleChange} 
                      required 
                    /> 
                  </div> 
                </div> 
                <div className="founderForm-row"> 
                  <div className="founderForm-group"> 
                    <label htmlFor="addfounder-company">Company</label> 
                    <input 
                      type="text" 
                      id="addfounder-company" 
                      name="company" 
                      placeholder="Enter company name" 
                      value={formData.company} 
                      onChange={handleChange} 
                      required 
                    /> 
                  </div> 
                  <div className="founderForm-group"> 
                    <label htmlFor="addfounder-linkedin">LinkedIn</label> 
                    <input 
                      type="text" 
                      id="addfounder-linkedin" 
                      name="linkedin" 
                      placeholder="Enter LinkedIn profile" 
                      value={formData.linkedin} 
                      onChange={handleChange} 
                      required 
                    /> 
                  </div> 
                </div> 
                <div className="founderForm-group"> 
                  <label htmlFor="addfounder-description">Description</label> 
                  <textarea 
                    id="addfounder-description" 
                    name="description" 
                    placeholder="Enter description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                  /> 
                </div> 
                <div className="founderForm-row"> 
                  <div className="founderForm-group"> 
                    <label htmlFor="addfounder-status">Status</label> 
                    <select id="addfounder-status" 
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
                <button type="submit" className="founderForm-submit-btn" disabled={isSubmitting}> 
                  {isSubmitting ? 'Submitting...' : 'Submit'} 
                </button> 
              </form> 
            </div> 
          </div> 
        )}

        <div className="founders-table-wrapper"> 
          {loading ? <div className="spinner"></div> : null} 
          <table className="founders-table"> 
            <thead> 
              <tr> 
                <th>Id</th> 
                <th>Name</th> 
 <th>Position</th> 
                <th>Company</th> 
                <th>LinkedIn</th> 
                <th>Description</th> 
                <th>Status</th> 
              </tr> 
            </thead> 
            <tbody> 
              {founders.length === 0 ? ( 
                <tr> 
                  <td colSpan="7"> 
                    <div className="no-data-container"> 
                      <img src={NoDataIllustration} alt="No Data Found" className="no-data-image" /> 
                      <p>No founders available at the moment.</p> 
                    </div> 
                  </td> 
                </tr> 
              ) : ( 
                founders.map((founder) => ( 
                  <tr key={founder.id}> 
                    <td>{founder.id}</td>
                    <td>{founder.name}</td>
                    <td className="position" title={founder.position}>
                    {founder.position}
                    </td>
                    <td>{founder.company}</td>
                    <td>{founder.linkedin}</td>
                    <td style={{ width: "100px", fontSize: "15px" }} className="founder-description" title={founder.description}>
                    {founder.description}
                    </td>

                    <td> 
                      <select 
                        id='trSelect' 
                        value={founder.status} 
                        onChange={(e) => handleStatusDropdownChange(e, founder.id)} 
                        style={{ 
                          backgroundColor: founder.status === 'Active' ? '#d4edda' : '#F8F4D7FF', 
                          color: founder.status === 'Active' ? 'green' : '#957C00FF', 
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

        <ToastContainer /> 
      </div> 
    </AdminSidebar> 
  ); 
} 

export default FounderManagement;