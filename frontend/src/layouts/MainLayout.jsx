import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../shared/components/layout';
import { useAuth } from '../shared/hooks/useRedux';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
