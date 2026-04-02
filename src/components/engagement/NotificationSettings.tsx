import { useNotificationPrefs } from "@/hooks/useEngagement";
import { Switch } from "@/components/ui/switch";
import { Bell, BookOpen, Sparkles, Trophy } from "lucide-react";

export default function NotificationSettings() {
  const { prefs, updatePrefs } = useNotificationPrefs();

  const settings = [
    {
      key: "new_chapters" as const,
      icon: BookOpen,
      title: "New Chapters",
      description: "Get notified when novels you follow release new chapters",
    },
    {
      key: "recommendations" as const,
      icon: Sparkles,
      title: "Recommendations",
      description: "Personalized novel suggestions based on your reading history",
    },
    {
      key: "achievements" as const,
      icon: Trophy,
      title: "Achievements",
      description: "Badge unlocks and milestone celebrations",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Notifications</h3>
          <p className="text-xs text-muted-foreground">Manage your notification preferences</p>
        </div>
      </div>

      <div className="space-y-3">
        {settings.map(({ key, icon: Icon, title, description }) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
            <Switch
              checked={prefs?.[key] ?? true}
              onCheckedChange={(checked) => updatePrefs.mutate({ [key]: checked })}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
