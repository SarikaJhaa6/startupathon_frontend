import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin');
  };

  return (
    <aside>
      <Link to="/admin/challenges">Dashboard</Link>
      <button onClick={handleLogout}>Logout</button>
    </aside>
  );
}

export default Sidebar;
