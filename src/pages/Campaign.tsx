import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Wallet } from 'lucide-react';
import { connectMetaMask, sendTransaction } from '../lib/web3';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  current_amount: number;
  created_at: string;
  image_url: string;
  user_id: string;
  wallet_address: string;
}

export default function Campaign() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);
  const [userWallet, setUserWallet] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  async function fetchCampaign() {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCampaign(data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnectWallet() {
    const address = await connectMetaMask();
    setUserWallet(address);
  }

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !campaign || !userWallet) return;

    setDonating(true);
    try {
      // Send ETH transaction
      const success = await sendTransaction(campaign.wallet_address, amount);
      
      if (success) {
        const donationAmount = parseFloat(amount);
        // Record donation in database
        const { error } = await supabase.from('donations').insert([
          {
            campaign_id: campaign.id,
            user_id: user.id,
            amount: donationAmount,
            wallet_address: userWallet,
          },
        ]);

        if (error) throw error;

        // Update campaign amount
        const { error: updateError } = await supabase
          .from('campaigns')
          .update({
            current_amount: campaign.current_amount + donationAmount,
          })
          .eq('id', campaign.id);

        if (updateError) throw updateError;

        // Refresh campaign data
        await fetchCampaign();
        setAmount('');
      }
    } catch (error) {
      console.error('Error processing donation:', error);
    } finally {
      setDonating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Campaign not found</h2>
      </div>
    );
  }

  const progress = (campaign.current_amount / campaign.goal) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <img
        src={campaign.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800'}
        alt={campaign.title}
        className="w-full h-96 object-cover rounded-lg"
      />
      <div className="mt-8">
        <h1 className="text-4xl font-bold text-gray-900">{campaign.title}</h1>
        <p className="mt-4 text-gray-600">{campaign.description}</p>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-rose-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {campaign.current_amount.toLocaleString()} ETH
                </p>
                <p className="text-gray-600">
                  raised of {campaign.goal.toLocaleString()} ETH goal
                </p>
              </div>
              <p className="text-gray-500">
                Created {formatDistanceToNow(new Date(campaign.created_at))} ago
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Campaign Wallet:</span>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {campaign.wallet_address}
              </span>
            </div>
          </div>

          {user && (
            <div className="mt-6 space-y-4">
              {!userWallet ? (
                <button
                  onClick={handleConnectWallet}
                  className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center space-x-2"
                >
                  <Wallet className="h-5 w-5" />
                  <span>Connect MetaMask</span>
                </button>
              ) : (
                <form onSubmit={handleDonate} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {userWallet.slice(0, 6)}...{userWallet.slice(-4)}
                    </span>
                  </div>
                  <div className="flex space-x-4">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount in ETH"
                      className="flex-1 rounded-lg border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                      min="0.01"
                      step="0.01"
                      required
                    />
                    <button
                      type="submit"
                      disabled={donating}
                      className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Heart className="h-5 w-5" />
                      <span>{donating ? 'Processing...' : 'Donate'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {!user && (
            <p className="mt-6 text-center text-gray-600">
              Please sign in to make a donation
            </p>
          )}
        </div>
      </div>
    </div>
  );
}