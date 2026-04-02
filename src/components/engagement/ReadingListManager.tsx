import { useState } from "react";
import { useReadingLists } from "@/hooks/useEngagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, BookOpen, Lock, Globe, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ReadingListManager() {
  const { lists, isLoading, createList, deleteList, removeFromList } = useReadingLists();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();

  const handleCreate = () => {
    if (!newName.trim()) return;
    createList.mutate(
      { name: newName, description: newDesc || undefined, isPublic },
      {
        onSuccess: () => {
          setNewName("");
          setNewDesc("");
          setShowCreate(false);
          toast({ title: "List created!", description: `"${newName}" is ready.` });
        },
      }
    );
  };

  if (isLoading) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Reading Lists</h3>
            <p className="text-xs text-muted-foreground">{lists?.length || 0} collections</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="gap-1">
          <Plus className="h-4 w-4" />
          New List
        </Button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
              <Input
                placeholder="List name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {isPublic ? "Public" : "Private"}
                </button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleCreate} disabled={!newName.trim()}>
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lists */}
      {!lists || lists.length === 0 ? (
        <div className="rounded-xl border border-border/40 bg-card p-8 text-center">
          <FolderOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No reading lists yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Create one to organize your favorite novels</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map((list: any) => (
            <motion.div
              key={list.id}
              className="rounded-xl border border-border/60 bg-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{list.name}</h4>
                  <Badge variant="secondary" className="text-[10px]">
                    {list.is_public ? "Public" : "Private"}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteList.mutate(list.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {list.description && (
                <p className="text-xs text-muted-foreground mb-3">{list.description}</p>
              )}

              {list.reading_list_items?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {list.reading_list_items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-xs"
                    >
                      <BookOpen className="h-3 w-3 text-primary" />
                      <Link
                        to={`/novel/${item.novel_id}`}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {item.novels?.title || "Novel"}
                      </Link>
                      <button
                        onClick={() => removeFromList.mutate({ listId: list.id, novelId: item.novel_id })}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/60">No novels in this list</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
