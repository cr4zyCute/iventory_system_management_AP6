import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './css/layout.css';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // On desktop, sidebar should be open by default
      if (!mobile) {
        setSidebarOpen(true);
      }
    };

    // Check initial screen size
    checkScreenSize();

    // Listen for window resize
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    // Only close sidebar on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="main-layout">
      <Navbar title={title} onMenuToggle={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
