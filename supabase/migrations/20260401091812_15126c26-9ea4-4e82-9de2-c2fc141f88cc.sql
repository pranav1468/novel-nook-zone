
-- Novel votes (upvote/downvote)
CREATE TABLE public.novel_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  novel_id uuid NOT NULL REFERENCES public.novels(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, novel_id)
);
ALTER TABLE public.novel_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all votes" ON public.novel_votes FOR SELECT TO public USING (true);
CREATE POLICY "Users can insert own votes" ON public.novel_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON public.novel_votes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON public.novel_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Novel reviews with ratings
CREATE TABLE public.novel_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  novel_id uuid NOT NULL REFERENCES public.novels(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  helpful_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, novel_id)
);
ALTER TABLE public.novel_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reviews" ON public.novel_reviews FOR SELECT TO public USING (true);
CREATE POLICY "Users can create reviews" ON public.novel_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.novel_reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.novel_reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Novel comments (threaded)
CREATE TABLE public.novel_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  novel_id uuid NOT NULL REFERENCES public.novels(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.novel_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.novel_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comments" ON public.novel_comments FOR SELECT TO public USING (true);
CREATE POLICY "Users can create comments" ON public.novel_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.novel_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.novel_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Novel requests
CREATE TABLE public.novel_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  original_language text,
  source_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'rejected')),
  vote_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.novel_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read requests" ON public.novel_requests FOR SELECT TO public USING (true);
CREATE POLICY "Users can create requests" ON public.novel_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own requests" ON public.novel_requests FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own requests" ON public.novel_requests FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Request votes
CREATE TABLE public.request_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id uuid NOT NULL REFERENCES public.novel_requests(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, request_id)
);
ALTER TABLE public.request_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read request votes" ON public.request_votes FOR SELECT TO public USING (true);
CREATE POLICY "Users can vote on requests" ON public.request_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove vote" ON public.request_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Contributions (translation/editing applications)
CREATE TABLE public.contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  novel_id uuid REFERENCES public.novels(id) ON DELETE SET NULL,
  contribution_type text NOT NULL CHECK (contribution_type IN ('translation', 'editing', 'proofreading')),
  language_from text,
  language_to text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own contributions" ON public.contributions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create contributions" ON public.contributions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Function to update request vote count
CREATE OR REPLACE FUNCTION public.update_request_vote_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.novel_requests SET vote_count = vote_count + 1 WHERE id = NEW.request_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.novel_requests SET vote_count = vote_count - 1 WHERE id = OLD.request_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_request_votes
AFTER INSERT OR DELETE ON public.request_votes
FOR EACH ROW EXECUTE FUNCTION public.update_request_vote_count();
