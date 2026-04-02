
-- Daily login streaks
CREATE TABLE public.user_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_login_date date NOT NULL DEFAULT CURRENT_DATE,
  total_logins integer NOT NULL DEFAULT 0,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks" ON public.user_streaks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON public.user_streaks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON public.user_streaks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Achievement badges
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'trophy',
  category text NOT NULL DEFAULT 'general',
  xp_reward integer NOT NULL DEFAULT 10,
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read achievements" ON public.achievements FOR SELECT TO public USING (true);

-- User earned achievements
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Reading lists / custom collections
CREATE TABLE public.reading_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reading_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own lists" ON public.reading_lists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public lists" ON public.reading_lists FOR SELECT TO public USING (is_public = true);
CREATE POLICY "Users can create lists" ON public.reading_lists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lists" ON public.reading_lists FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lists" ON public.reading_lists FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Reading list items
CREATE TABLE public.reading_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid NOT NULL REFERENCES public.reading_lists(id) ON DELETE CASCADE,
  novel_id uuid NOT NULL REFERENCES public.novels(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE(list_id, novel_id)
);

ALTER TABLE public.reading_list_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own list items" ON public.reading_list_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.reading_lists WHERE id = list_id AND user_id = auth.uid())
);
CREATE POLICY "Anyone can view public list items" ON public.reading_list_items FOR SELECT TO public USING (
  EXISTS (SELECT 1 FROM public.reading_lists WHERE id = list_id AND is_public = true)
);
CREATE POLICY "Users can add to own lists" ON public.reading_list_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.reading_lists WHERE id = list_id AND user_id = auth.uid())
);
CREATE POLICY "Users can remove from own lists" ON public.reading_list_items FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.reading_lists WHERE id = list_id AND user_id = auth.uid())
);

-- Notification preferences
CREATE TABLE public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  new_chapters boolean NOT NULL DEFAULT true,
  recommendations boolean NOT NULL DEFAULT true,
  achievements boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own prefs" ON public.notification_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own prefs" ON public.notification_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prefs" ON public.notification_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Seed achievements
INSERT INTO public.achievements (name, description, icon, category, xp_reward, requirement_type, requirement_value) VALUES
  ('First Step', 'Read your first chapter', 'book-open', 'reading', 10, 'chapters_read', 1),
  ('Bookworm', 'Read 10 chapters', 'book', 'reading', 50, 'chapters_read', 10),
  ('Scholar', 'Read 50 chapters', 'graduation-cap', 'reading', 200, 'chapters_read', 50),
  ('Library Master', 'Read 100 chapters', 'library', 'reading', 500, 'chapters_read', 100),
  ('First Login', 'Log in for the first time', 'log-in', 'streak', 5, 'total_logins', 1),
  ('3 Day Streak', 'Maintain a 3-day login streak', 'flame', 'streak', 30, 'login_streak', 3),
  ('Week Warrior', 'Maintain a 7-day login streak', 'zap', 'streak', 100, 'login_streak', 7),
  ('Monthly Devotee', 'Maintain a 30-day login streak', 'crown', 'streak', 500, 'login_streak', 30),
  ('First Review', 'Write your first review', 'message-square', 'community', 20, 'reviews_written', 1),
  ('Critic', 'Write 5 reviews', 'star', 'community', 100, 'reviews_written', 5),
  ('Commentator', 'Post 10 comments', 'message-circle', 'community', 50, 'comments_posted', 10),
  ('Collector', 'Add 5 novels to your library', 'bookmark', 'collection', 30, 'novels_bookmarked', 5),
  ('Curator', 'Create your first reading list', 'list', 'collection', 25, 'lists_created', 1),
  ('Voter', 'Vote on 10 novels', 'thumbs-up', 'community', 40, 'votes_cast', 10),
  ('Explorer', 'Read novels from 5 different genres', 'compass', 'reading', 150, 'genres_explored', 5);
