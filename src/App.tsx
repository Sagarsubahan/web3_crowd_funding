import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Campaign from './pages/Campaign';
import CreateCampaign from './pages/CreateCampaign';
import AuthCallback from './pages/AuthCallback';
import BedrockPassportContext from './context/BedrockPassportContext';
import { AuthProvider } from './context/AuthContext';
import BedrockSupabaseSync from './components/BedrockSupabaseSync';

function App() {
  return (
    <BedrockPassportContext>
      <AuthProvider>
        <Router>
          <BedrockSupabaseSync />
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/campaign/:id" element={<Campaign />} />
                <Route path="/create" element={<CreateCampaign />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </BedrockPassportContext>
  );
}

export default App;