import { lazy, Suspense } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { citiesConfigMap } from "@/lib/cities-config";
import { getLegacyRedirect } from "@/components/LegacyRedirects";

const CidadeLandingPage = lazy(() => import("@/pages/cidades/CidadeLandingPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function CatchAllHandler() {
  const location = useLocation();
  const path = location.pathname;

  // 1. City route
  const cityMatch = path.match(/^\/contabilidade-em-(.+)$/);
  if (cityMatch) {
    const slug = cityMatch[1];
    if (citiesConfigMap[slug]) {
      return (
        <Suspense fallback={<PageFallback />}>
          <CidadeLandingPage />
        </Suspense>
      );
    }
  }

  // 2. Legacy redirect
  const legacyTarget = getLegacyRedirect(path);
  if (legacyTarget) {
    return <Navigate to={legacyTarget} replace />;
  }

  // 3. 404
  return (
    <Suspense fallback={<PageFallback />}>
      <NotFound />
    </Suspense>
  );
}
