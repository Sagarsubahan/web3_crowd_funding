import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import LoginButton from './LoginButton';
import { useBedrockPassport } from '@bedrock_org/passport';

export default function Navbar() {
  const { isLoggedIn } = useBedrockPassport();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold">FundRaiser</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <Link
                to="/create"
                className="flex items-center space-x-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Create Campaign</span>
              </Link>
            )}
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
}