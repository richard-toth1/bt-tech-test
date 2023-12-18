import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import auctionRoutes from './routes/auction';
import bidRoutes from './routes/bid';
import authRoutes from './routes/auth';
import { List } from './components/auction';
import { AuthProvider } from './context/AuthProvider';
import './index.css'
import NavBar from './components/auth/NavBar';

const NotFound = () => (
  <h1>Not Found</h1>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router basename='/'>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<List />} key="home"/>
          { auctionRoutes }
          { bidRoutes }
          { authRoutes }
          <Route element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);