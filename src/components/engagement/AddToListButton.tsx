import { useState } from "react";
import { useReadingLists } from "@/hooks/useEngagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderPlus, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AddToListButtonProps {
  novelId: string;
}

export default function AddToListButton({ novelId }: AddToListButtonProps) {
  const { lists, addToList, createList } = useReadingLists();
  const [open, setOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const { toast } = useToast();

  const isInList = (listId: string) =>
    lists?.find((l: any) => l.id === listId)?.reading_list_items?.some(
      (item: any) => item.novel_id === novelId
    );

  const handleAdd = (listId: string) => {
    if (isInList(listId)) return;
    addToList.mutate(
      { listId, novelId },
      {
        onSuccess: () => {
          toast({ title: "Added!", description: "Novel added to your list." });
        },
      }
    );
  };

  const handleCreateAndAdd = () => {
    if (!newListName.trim()) return;
    createList.mutate(
      { name: newListName },
      {
        onSuccess: () => {
          setNewListName("");
          toast({ title: "List created!", description: `"${newListName}" is ready.` });
        },
      }
    );
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-1.5"
      >
        <FolderPlus className="h-4 w-4" />
        Add to List
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute top-full mt-2 right-0 z-50 w-64 rounded-xl border border-border/60 bg-card p-3 shadow-lg"
          >
            {lists && lists.length > 0 ? (
              <div className="space-y-1 mb-3 max-h-40 overflow-y-auto">
                {lists.map((list: any) => {
                  const added = isInList(list.id);
                  return (
                    <button
                      key={list.id}
                      onClick={() => handleAdd(list.id)}
                      disabled={added}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                        added
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <span className="truncate">{list.name}</span>
                      {added && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mb-3 text-center py-2">No lists yet</p>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="New list..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="h-8 text-xs"
                onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
              />
              <Button size="sm" onClick={handleCreateAndAdd} disabled={!newListName.trim()} className="h-8 px-2">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
