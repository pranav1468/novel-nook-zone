import { Share2, Twitter, Facebook, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  url?: string;
  compact?: boolean;
}

export default function SocialShare({ title, url, compact }: SocialShareProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const text = `Check out "${title}" on NovelHub!`;

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share it with your friends." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, text, url: shareUrl });
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <link.icon className="h-4 w-4" />
          </a>
        ))}
        <button
          onClick={handleCopy}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {navigator.share && (
        <Button variant="outline" size="sm" onClick={handleNativeShare} className="gap-1.5">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      )}
      {shareLinks.map((link) => (
        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-1.5">
            <link.icon className="h-4 w-4" />
            {link.name}
          </Button>
        </a>
      ))}
      <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Copied" : "Copy Link"}
      </Button>
    </div>
  );
}
