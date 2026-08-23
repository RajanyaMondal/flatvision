-- Supabase Schema for FlatVision AI

-- 1. Create Predictions Table
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    input_features JSONB NOT NULL,
    predicted_price NUMERIC NOT NULL,
    model_name TEXT NOT NULL,
    prediction_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Users can only view their own predictions
CREATE POLICY "Users can view their own predictions" 
ON public.predictions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own predictions
CREATE POLICY "Users can insert their own predictions" 
ON public.predictions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own predictions
CREATE POLICY "Users can delete their own predictions" 
ON public.predictions 
FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Create an index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON public.predictions(user_id);
