/*
  # Initial Schema Setup for Crowdfunding Application

  1. New Tables
    - `campaigns`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `goal` (numeric)
      - `current_amount` (numeric)
      - `image_url` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

    - `donations`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, references campaigns)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on both tables
    - Add policies for:
      - Anyone can view campaigns
      - Only authenticated users can create campaigns
      - Only campaign owners can update their campaigns
      - Anyone can view donations
      - Only authenticated users can create donations
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  goal numeric NOT NULL CHECK (goal > 0),
  current_amount numeric NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  image_url text,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Campaigns policies
CREATE POLICY "Anyone can view campaigns"
  ON campaigns
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create campaigns"
  ON campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Campaign owners can update their campaigns"
  ON campaigns
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Donations policies
CREATE POLICY "Anyone can view donations"
  ON donations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create donations"
  ON donations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger for campaigns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE
  ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();