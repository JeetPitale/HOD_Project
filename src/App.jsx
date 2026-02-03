import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import EBooks from './pages/EBooks';
import Contact from './pages/Contact';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="blog" element={<Blog />} />
              <Route path="ebooks" element={<EBooks />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<AdminLogin />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
