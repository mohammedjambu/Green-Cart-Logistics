import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <div className="container mx-auto p-6">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;