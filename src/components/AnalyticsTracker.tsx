import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/hooks/use-analytics";

export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}
