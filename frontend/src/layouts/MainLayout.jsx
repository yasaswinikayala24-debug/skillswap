import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const MainLayout = ({ children }) => {
  return (
    <div className="relative flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white overflow-x-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
