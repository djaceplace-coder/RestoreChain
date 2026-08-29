-- Drop existing tables to start fresh (optional, remove if you want to keep data)
-- DROP TABLE IF EXISTS tax_reports, notifications, wallet_connections, portfolios, nft_assets, defi_positions, user_documents, kyc_documents, support_messages, support_tickets, reconciliation_issues, wallets, transactions, profiles;

-- Profiles Table (Extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'user',
    kyc_status TEXT DEFAULT 'unverified',
    total_balance NUMERIC DEFAULT 0,
    fiat_balance NUMERIC DEFAULT 0,
    tier TEXT DEFAULT 'free',
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Transactions Table
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    type TEXT,
    amount NUMERIC,
    asset TEXT,
    status TEXT DEFAULT 'completed',
    tx_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Wallets Table
CREATE TABLE wallets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    address TEXT,
    network TEXT,
    balance NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Reconciliation Issues Table
CREATE TABLE reconciliation_issues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    status TEXT DEFAULT 'open',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Support Tickets Table
CREATE TABLE support_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    subject TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Support Messages Table
CREATE TABLE support_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ticket_id UUID REFERENCES support_tickets(id),
    message TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- KYC Documents Table
CREATE TABLE kyc_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    document_type TEXT,
    document_url TEXT,
    document_back_url TEXT,
    selfie_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- User Documents Table (NDAs, Agreements)
CREATE TABLE user_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    document_type TEXT,
    signature_data TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- DeFi Positions Table
CREATE TABLE defi_positions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    protocol TEXT,
    asset TEXT,
    amount NUMERIC,
    value NUMERIC,
    apy NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- NFT Assets Table
CREATE TABLE nft_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    collection TEXT,
    name TEXT,
    image_url TEXT,
    value NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Portfolios Table
CREATE TABLE portfolios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    assets_json JSONB,
    total_value NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Wallet Connections Table
CREATE TABLE wallet_connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    wallet_type TEXT,
    address TEXT,
    network TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    title TEXT,
    message TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Tax Reports Table
CREATE TABLE tax_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    year TEXT,
    report_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Turn on Row Level Security for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE defi_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_reports ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow users to read/write their own data
-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Other tables: user can view/insert/update their own rows based on user_id
CREATE POLICY "Users can view own records" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own wallets" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallets" ON wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own recon" ON reconciliation_issues FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recon" ON reconciliation_issues FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own messages" ON support_messages FOR SELECT USING (EXISTS (SELECT 1 FROM support_tickets st WHERE st.id = support_messages.ticket_id AND st.user_id = auth.uid()));
CREATE POLICY "Users can insert own messages" ON support_messages FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM support_tickets st WHERE st.id = ticket_id AND st.user_id = auth.uid()));

CREATE POLICY "Users can view own kyc" ON kyc_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own kyc" ON kyc_documents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own docs" ON user_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own docs" ON user_documents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own defi" ON defi_positions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own defi" ON defi_positions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own nfts" ON nft_assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own nfts" ON nft_assets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own portfolios" ON portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own portfolios" ON portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolios" ON portfolios FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own connections" ON wallet_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own connections" ON wallet_connections FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own tax reports" ON tax_reports FOR SELECT USING (auth.uid() = user_id);

-- Create a Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Optional: Allow Admin Users full access (Note: this relies on role = 'admin' in profiles)
-- In a real production setup, you would create a separate function to check role safely
CREATE POLICY "Admins have full access" ON profiles FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
CREATE POLICY "Admins have full access to transactions" ON transactions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
CREATE POLICY "Admins have full access to user docs" ON user_documents FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
CREATE POLICY "Admins have full access to kyc" ON kyc_documents FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
CREATE POLICY "Admins have full access to support tickets" ON support_tickets FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
CREATE POLICY "Admins have full access to support messages" ON support_messages FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
CREATE POLICY "Admins have full access to recon" ON reconciliation_issues FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
