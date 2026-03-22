import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/20 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">
              Novel<span className="text-primary">Hub</span>
            </span>
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">
            Your home for web novels. Read, discover, and track your favorite stories.
          </p>
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} NovelHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
