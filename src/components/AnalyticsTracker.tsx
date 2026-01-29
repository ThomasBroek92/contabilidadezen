import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, initializeGA } from "@/hooks/use-analytics";

export function AnalyticsTracker() {
  const location = useLocation();

  // Initialize analytics on mount
  useEffect(() => {
    initializeGA();
  }, []);

  useEffect(() => {
    // Track page view on route change (SPA History Change)
    // Pequeno delay para garantir que o título da página foi atualizado
    const timer = setTimeout(() => {
      trackPageView(location.pathname + location.search);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location]);

  return null;
}

