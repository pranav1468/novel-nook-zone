import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorSpotlight from "@/components/CursorSpotlight";
import AnimatedRoutes from "@/components/AnimatedRoutes";
import { useAutoLogin } from "@/hooks/useEngagement";

const queryClient = new QueryClient();

function AppContent() {
  useAutoLogin();
  return (
    <>
      <CursorSpotlight />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
