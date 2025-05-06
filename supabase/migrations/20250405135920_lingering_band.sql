/*
  # Add Wallet Address to Campaigns and Donations

  1. Changes
    - Add wallet_address column to campaigns table
    - Add wallet_address column to donations table for tracking donor addresses

  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS wallet_address text NOT NULL;

ALTER TABLE donations
ADD COLUMN IF NOT EXISTS wallet_address text;