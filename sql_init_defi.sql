CREATE TABLE IF NOT EXISTS public.defi_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol TEXT NOT NULL,
  type TEXT NOT NULL,
  asset TEXT NOT NULL,
  balance NUMERIC DEFAULT 0,
  apy NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.defi_positions DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.nfts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  collection TEXT NOT NULL,
  floor_price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.nfts DISABLE ROW LEVEL SECURITY;
