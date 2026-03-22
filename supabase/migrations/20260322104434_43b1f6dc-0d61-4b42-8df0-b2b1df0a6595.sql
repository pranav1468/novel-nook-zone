
-- Create enum for novel status
CREATE TYPE public.novel_status AS ENUM ('ongoing', 'completed', 'hiatus');

-- Create novels table
CREATE TABLE public.novels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  synopsis TEXT,
  cover_url TEXT,
  genre TEXT[] NOT NULL DEFAULT '{}',
  status novel_status NOT NULL DEFAULT 'ongoing',
  chapter_count INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  novel_id UUID NOT NULL REFERENCES public.novels(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(novel_id, chapter_number)
);

-- Create user_libraries table (bookmarking)
CREATE TABLE public.user_libraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  novel_id UUID NOT NULL REFERENCES public.novels(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, novel_id)
);

-- Enable RLS
ALTER TABLE public.novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_libraries ENABLE ROW LEVEL SECURITY;

-- Novels: everyone can read
CREATE POLICY "Anyone can read novels" ON public.novels FOR SELECT USING (true);

-- Chapters: everyone can read
CREATE POLICY "Anyone can read chapters" ON public.chapters FOR SELECT USING (true);

-- User libraries: users can manage their own
CREATE POLICY "Users can view their library" ON public.user_libraries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to library" ON public.user_libraries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from library" ON public.user_libraries FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_novels_genre ON public.novels USING GIN(genre);
CREATE INDEX idx_novels_status ON public.novels(status);
CREATE INDEX idx_novels_rating ON public.novels(rating DESC);
CREATE INDEX idx_novels_views ON public.novels(views DESC);
CREATE INDEX idx_novels_created_at ON public.novels(created_at DESC);
CREATE INDEX idx_chapters_novel_id ON public.chapters(novel_id, chapter_number);
CREATE INDEX idx_user_libraries_user_id ON public.user_libraries(user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_novels_updated_at
  BEFORE UPDATE ON public.novels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
