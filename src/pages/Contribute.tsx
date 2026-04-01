import { useState } from "react";
import { motion } from "framer-motion";
import { Languages, PenTool, CheckSquare, Send, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useMyContributions, useCreateContribution } from "@/hooks/useCommunity";

const types = [
  { value: "translation" as const, label: "Translation", icon: Languages, desc: "Translate novels to/from different languages" },
  { value: "editing" as const, label: "Editing", icon: PenTool, desc: "Improve grammar, style, and readability" },
  { value: "proofreading" as const, label: "Proofreading", icon: CheckSquare, desc: "Review and fix errors in existing translations" },
];

export default function Contribute() {
  const { data: contributions } = useMyContributions();
  const createContribution = useCreateContribution();
  const [selectedType, setSelectedType] = useState<"translation" | "editing" | "proofreading" | null>(null);
  const [langFrom, setLangFrom] = useState("");
  const [langTo, setLangTo] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!selectedType || !message.trim()) return;
    createContribution.mutate(
      {
        contribution_type: selectedType,
        language_from: langFrom.trim() || undefined,
        language_to: langTo.trim() || undefined,
        message: message.trim(),
      },
      {
        onSuccess: () => {
          setSelectedType(null); setLangFrom(""); setLangTo(""); setMessage("");
        },
      }
    );
  };

  return (
    <main className="min-h-screen py-10">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Contribute</h1>
          </div>
          <p className="text-muted-foreground">
            Help grow the platform by translating, editing, or proofreading novels. Your contributions matter!
          </p>
        </motion.div>

        {/* Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {types.map((t, i) => {
            const Icon = t.icon;
            const active = selectedType === t.value;
            return (
              <motion.button
                key={t.value}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedType(active ? null : t.value)}
                className={`rounded-xl border p-5 text-left transition-all ${
                  active
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/40 bg-card hover:border-primary/30"
                }`}
              >
                <Icon className={`h-6 w-6 mb-3 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="font-semibold text-foreground mb-1">{t.label}</h3>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Application Form */}
        {selectedType && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="rounded-xl border border-border/60 bg-card p-6 space-y-4 mb-8"
          >
            <h3 className="font-semibold text-foreground">Apply as {selectedType}</h3>
            {selectedType === "translation" && (
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Language from" value={langFrom} onChange={(e) => setLangFrom(e.target.value)} />
                <Input placeholder="Language to" value={langTo} onChange={(e) => setLangTo(e.target.value)} />
              </div>
            )}
            <Textarea
              placeholder="Tell us about your experience and what you'd like to contribute..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <Button onClick={submit} disabled={!message.trim() || createContribution.isPending} className="gap-1.5">
              <Send className="h-4 w-4" />
              {createContribution.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </motion.div>
        )}

        {/* My Contributions */}
        {contributions && contributions.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Your Applications</h2>
            <div className="space-y-3">
              {contributions.map((c: any) => (
                <div key={c.id} className="rounded-xl border border-border/40 bg-card p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground capitalize">{c.contribution_type}</span>
                      <Badge variant={c.status === "approved" ? "default" : "secondary"} className="text-xs">
                        {c.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{c.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
