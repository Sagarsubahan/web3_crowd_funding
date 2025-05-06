/*
  # Add wallet address support for campaigns and donations

  1. Changes
    - Add wallet_address column to campaigns table
    - Add wallet_address column to donations table
    - Set default wallet address for existing campaigns
  
  2. Security
    - Maintains existing RLS policies
    - No changes to security settings required
*/

-- First add the columns allowing NULL
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS wallet_address text;

ALTER TABLE donations
ADD COLUMN IF NOT EXISTS wallet_address text;

-- Update existing campaigns with a default wallet address
UPDATE campaigns 
SET wallet_address = '0x9018df372C9186359e85360571aFDE895F77DADb' 
WHERE wallet_address IS NULL;

-- Make wallet_address NOT NULL for campaigns after setting defaults
ALTER TABLE campaigns
ALTER COLUMN wallet_address SET NOT NULL;