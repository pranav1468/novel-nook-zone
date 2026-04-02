import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Search, BookOpen, Menu, X, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ScrollProgress from "@/components/ScrollProgress";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/rankings", label: "Rankings" },
  { to: "/requests", label: "Requests" },
  { to: "/contribute", label: "Contribute" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <ScrollProgress />
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <BookOpen className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Novel<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop links with active indicator */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-md",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-md bg-muted/60"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link to="/browse">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            <motion.div whileTap={{ rotate: 180 }} transition={{ duration: 0.3 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </motion.div>

            {user ? (
              <Link to="/profile" className="hidden md:block">
                <Button size="sm" variant="outline" className="gap-1.5 active:scale-[0.97] transition-transform">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button size="sm" className="active:scale-[0.97] transition-transform">
                  Sign In
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "overflow-hidden border-t border-border/60 md:hidden transition-all duration-300 ease-out",
            mobileOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium",
                  location.pathname === link.to
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link to="/profile" onClick={() => setMobileOpen(false)}>
                <Button size="sm" variant="outline" className="mt-2 w-full gap-1.5 active:scale-[0.97]">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="mt-2 w-full active:scale-[0.97]">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
