import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DailyRewards from "@/components/engagement/DailyRewards";
import AchievementBadges from "@/components/engagement/AchievementBadges";
import ReadingListManager from "@/components/engagement/ReadingListManager";
import NotificationSettings from "@/components/engagement/NotificationSettings";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      if (!user) navigate("/auth");
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <main className="min-h-screen py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile header */}
        <section className="mx-auto max-w-7xl px-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Your Profile</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </section>

        <DailyRewards />
        <AchievementBadges />
        <ReadingListManager />
        <NotificationSettings />
      </motion.div>
    </main>
  );
}
