import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ConstellationField } from '../shaders/constellation-field/ConstellationField';
import '../shaders/threeui.css';

const MainLayout = ({ children }) => {
  return (
    <div className="relative flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Background Animated Constellation Field Wallpaper */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
        <ConstellationField
          mode="dark"
          speed={1.00}
          size={1.00}
          strokeWidth={1.00}
          length={1.00}
          density={1.00}
          opacity={1.00}
          hue={0}
          saturation={1.00}
          brightness={1.00}
        />
      </div>

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
