import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const zoomLevel = window.devicePixelRatio;

      document.documentElement.style.setProperty('--nav-font-size', zoomLevel >= 1.25 ? '14px' : '16px');

      setIsMobile(zoomLevel >= 1.5 || width <= 1024);
    };

    handleResize(); // Initialize on load
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      // Navigate to home first, then scroll after a short delay
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 500); // Adjust delay as needed
    } else {
      // Directly scroll if already on the home page
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="new-startupathon-nav">
      <div className="navigation-wrap">
        <nav className="navigation w-nav">
          <div className="navigation-container">
            {/* Logo */}
            <div className="navigation-left">
              <Link to="/" className="brand-4 w-nav-brand">
                <img src="/images/logo.svg" alt="Persist Startupathon" className="global-logo" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
              </div>
            )}

            {/* Navigation Links */}
            <div className={`navigation-right ${isMobile ? (menuOpen ? "mobile-open" : "mobile-closed") : ""}`}>
              <nav className="nav-menu-3 w-nav-menu">
                <span onClick={() => scrollToSection('ongoing-pro')} className="navigation-link">
                  Ongoing Startupathon
                </span>
                <span onClick={() => scrollToSection('completed-startupathon')} className="navigation-link">
                  Completed Startupathon
                </span>
                <span onClick={() => scrollToSection('startupathon-guide')} className="navigation-link">
                  Startupathon Guide
                </span>
                <Link to="/how-to-win" className="navigation-link">
                  How To Win
                </Link>
                <span onClick={() => scrollToSection('mentor-network')} className="navigation-link">
                  Mentor Network
                </span>
              </nav>
              
              {/* Apply For Fellowship Button */}
              <Link
                to="/startupathon-fellowship"
                target="_blank"
                className="css-button accept-challenge-btn new-fellowship-btn fello-btn-on-startupathon-page w-inline-block"
              >
                Apply For Fellowship
              </Link>

              {/* Admin Image Link */}
              <a 
                href="/admin" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="admin-image-link"
                title="Admin"
              >
                <img src="/images/adminImg.png" alt="Admin" className="admin-img" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
