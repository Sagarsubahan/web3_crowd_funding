import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  current_amount: number;
  created_at: string;
  image_url: string;
}

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Active Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            to={`/campaign/${campaign.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={campaign.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800'}
              alt={campaign.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {campaign.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {campaign.description}
              </p>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-rose-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (campaign.current_amount / campaign.goal) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    ${campaign.current_amount.toLocaleString()} raised
                  </span>
                  <span className="text-gray-600">
                    ${campaign.goal.toLocaleString()} goal
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Created {formatDistanceToNow(new Date(campaign.created_at))} ago
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}