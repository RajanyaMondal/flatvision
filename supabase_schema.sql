-- Supabase Schema for FlatVision AI (Clerk Integration)

-- 1. Create Predictions Table
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Changed from UUID to TEXT to store Clerk user IDs
    input_features JSONB NOT NULL,
    predicted_price NUMERIC NOT NULL,
    model_name TEXT NOT NULL,
    prediction_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies using Clerk JWT Claims
-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Users can insert their own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Users can delete their own predictions" ON public.predictions;

-- Users can only view their own predictions (Clerk sub claim = user_id)
CREATE POLICY "Users can view their own predictions" 
ON public.predictions 
FOR SELECT 
USING (auth.jwt() ->> 'sub' = user_id);

-- Users can insert their own predictions
CREATE POLICY "Users can insert their own predictions" 
ON public.predictions 
FOR INSERT 
WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Users can delete their own predictions
CREATE POLICY "Users can delete their own predictions" 
ON public.predictions 
FOR DELETE 
USING (auth.jwt() ->> 'sub' = user_id);

-- 4. Create an index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON public.predictions(user_id);
