ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'unverified';

CREATE TABLE public.user_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  signature_data TEXT, -- Base64
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own documents" ON public.user_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all documents" ON public.user_documents FOR ALL USING (is_admin());

-- Add withdraw/deposit to transactions if needed... wait, the type is already 'Deposit', 'Withdrawal'.

