-- 1. Add KYC Status to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS kyc_status text DEFAULT 'unverified';

-- 2. Create the KYC Documents table
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL, -- 'passport', 'drivers_license', 'ssn_card', 'national_id'
  document_url text,           -- Secure Base64 payload / Image URL for the ID Front
  document_back_url text,      -- Back of the document (if applicable)
  selfie_url text,             -- Secure Base64 payload / Image URL for the Selfie
  status text DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  admin_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS (Row Level Security) on KYC
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- 4. Set highly restricted Security Policies
CREATE POLICY "Users can insert their own KYC documents"
  ON public.kyc_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own KYC documents"
  ON public.kyc_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all KYC documents"
  ON public.kyc_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update KYC documents"
  ON public.kyc_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
