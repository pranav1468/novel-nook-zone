

## NovelHub — Novel Reading Platform

### Overview
A spacious, clean novel reading platform inspired by WTR-Lab and FictionZone, with dark/light theme toggle, Supabase backend, and interactive UI.

### Pages

**1. Homepage**
- Hero section with a large tagline and background mosaic of novel covers (inspired by FictionZone), with "Explore Library" and "Sign In" CTAs
- **Recently Added Novels** — horizontal scrollable card carousel with cover, title, genre badge, chapter count
- **Trending Novels** — grid of novel covers with ranking numbers, views, and ratings
- **Featured / Editor's Picks** — larger promotional cards with descriptions
- **Genre Categories** — browsable genre chips/cards (Action, Fantasy, Romance, Sci-Fi, etc.)
- **Rankings sidebar** — Daily / Weekly / Monthly tabs with top novels list

**2. Browse / Library Page**
- Filter by genre, status (ongoing/completed), sort by popularity/latest/rating
- Grid layout of novel cards with lazy loading
- Search bar with instant filtering

**3. Novel Detail Page**
- Cover image, title, author, genres, rating, views, chapter count
- Synopsis section
- Chapter list (expandable)
- Add to Library / Bookmark button

**4. Authentication**
- Sign in / Sign up with Supabase Auth (email)

### Design Principles
- **Spacious**: Generous padding and whitespace, no clutter
- **Dark/Light toggle**: Dark theme as default, toggle in navbar
- **Minimal & functional**: Clean cards, subtle shadows, smooth hover effects
- **Responsive**: Mobile-first, works well on all screen sizes

### Database (Supabase)
- `novels` table — id, title, author, synopsis, cover_url, genre, status, chapter_count, views, rating, created_at
- `chapters` table — id, novel_id, chapter_number, title, content, created_at
- `user_libraries` table — id, user_id, novel_id, added_at (bookmarking)
- Seed with ~20 sample novels across various genres

### Tech
- React + Tailwind + shadcn/ui
- Supabase for auth, database, and storage
- Framer Motion for subtle animations
- Theme toggle with next-themes pattern (CSS variables)

