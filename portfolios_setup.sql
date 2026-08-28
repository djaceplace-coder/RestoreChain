-- Create portfolios table (for user's asset holdings)
CREATE TABLE IF NOT EXISTS public.portfolios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  asset_symbol text NOT NULL, -- e.g. BTC, ETH
  asset_name text,            -- e.g. Bitcoin
  balance numeric DEFAULT 0,  -- The amount of tokens the user holds
  average_buy_price numeric DEFAULT 0, -- Used for PNL calculation
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own portfolios"
  ON public.portfolios FOR SELECT
  USING (auth.uid() = user_id);
