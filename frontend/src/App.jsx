import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import store from './app/store';
import Router from './app/router';
import { setToken } from './features/auth/authSlice';
import { getProfile } from './features/auth/authSlice';
import useAuthSync from './shared/hooks/useAuthSync';
import './styles/index.css';

function AppContent() {
  const dispatch = useDispatch();
  
  // Auto-sync auth data
  useAuthSync();

  // Check for token on app startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setToken(token));
      dispatch(getProfile());
    }
  }, [dispatch]);

  return <Router />;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <AppContent />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
