import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrophy, FaUsers, FaUserTie, FaEnvelope, FaSignOutAlt, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import './AdminSidebar.css';

function Sidebar({ collapsed, toggleSidebar, activeTab, setActiveTab, handleLogout }) {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src="/images/userimg.webp" alt="Admin" className="user-icon" />
        {!collapsed && <span className="admin-title">Admin</span>}
      </div>

      <div className="sidebar-menu">
        <SidebarItem 
          icon={<FaTrophy />} 
          label="Challenges" 
          collapsed={collapsed} 
          active={activeTab === 'Challenges'} 
          onClick={() => setActiveTab('Challenges')} 
        />
        <SidebarItem 
          icon={<FaUsers />} 
          label="Completers" 
          collapsed={collapsed} 
          active={activeTab === 'Completers'} 
          onClick={() => setActiveTab('Completers')} 
        />
        <SidebarItem 
          icon={<FaUserTie />} 
          label="Founders" 
          collapsed={collapsed} 
          active={activeTab === 'Founders'} 
          onClick={() => setActiveTab('Founders')} 
        />
        <SidebarItem 
          icon={<FaEnvelope />} 
          label="Subscribers" 
          collapsed={collapsed} 
          active={activeTab === 'Subscribers'} 
          onClick={() => setActiveTab('Subscribers')} 
        />
        <SidebarItem 
          icon={<FaSignOutAlt />} 
          label="Logout" 
          collapsed={collapsed} 
          onClick={handleLogout} 
        />
      </div>

      <button className="toggle-btn" onClick={toggleSidebar}>
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>
    </div>
  );
}

function SidebarItem({ icon, label, collapsed, active, onClick }) {
  return (
    <div className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}
      {!collapsed && <span>{label}</span>}
    </div>
  );
}

function AdminSidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();  // Access the current URL location

  // Check if admin is logged in
  const admin = localStorage.getItem('admin');
  if (!admin) {
    navigate('/admin');
  }

  const savedTab = localStorage.getItem('activeTab');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState(savedTab || 'Challenges'); // Default to 'Challenges' if no saved tab

  useEffect(() => {
    // Update the activeTab when the URL changes
    const path = location.pathname.split('/').pop(); // Get the last segment of the path
    const tab = path.charAt(0).toUpperCase() + path.slice(1); // Capitalize the first letter

    if (['Challenges', 'Completers', 'Founders', 'Subscribers'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]); // This will run whenever the URL changes

  useEffect(() => {
    // Save the activeTab to localStorage whenever it changes
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('activeTab'); // Clear activeTab on logout
    navigate('/admin');
  };

  return (
    <div className="admin-dashboard">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === "Challenges") navigate('/admin/challenges');
          if (tab === "Completers") navigate('/admin/completers');
          if (tab === "Founders") navigate('/admin/founders');
          if (tab === "Subscribers") navigate('/admin/subscribers');
        }} 
        handleLogout={handleLogout} 
      />
      
      {/* Main Content Wrapper */}
      <div className={`content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default AdminSidebar;
