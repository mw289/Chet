-- Create simulations table for saving user simulations (v2)
CREATE TABLE IF NOT EXISTS public.simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  html_content TEXT NOT NULL,
  physics_concepts TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own simulations" ON public.simulations;
DROP POLICY IF EXISTS "Users can insert own simulations" ON public.simulations;
DROP POLICY IF EXISTS "Users can update own simulations" ON public.simulations;
DROP POLICY IF EXISTS "Users can delete own simulations" ON public.simulations;

-- Create policies
CREATE POLICY "Users can view own simulations" ON public.simulations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations" ON public.simulations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations" ON public.simulations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own simulations" ON public.simulations
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS on_simulations_updated ON public.simulations;
CREATE TRIGGER on_simulations_updated
  BEFORE UPDATE ON public.simulations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
DROP INDEX IF EXISTS simulations_user_id_idx;
DROP INDEX IF EXISTS simulations_created_at_idx;
CREATE INDEX simulations_user_id_idx ON public.simulations(user_id);
CREATE INDEX simulations_created_at_idx ON public.simulations(created_at DESC);

-- Grant necessary permissions
GRANT ALL ON public.simulations TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
