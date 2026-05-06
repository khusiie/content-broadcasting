import { memo } from 'react';
import Navbar from '../components/Navbar';
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16 lg:pl-60 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
export default memo(DashboardLayout);
