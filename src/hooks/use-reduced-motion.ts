import { useState, useEffect } from "react";

/**
 * Hook para detectar se animações devem ser reduzidas.
 * Retorna true se:
 * - O usuário tem prefers-reduced-motion ativado
 * - Está em dispositivo móvel (para performance)
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Detectar preferência do sistema por movimento reduzido
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Detectar se é mobile (largura < 768px)
    const isMobile = window.matchMedia("(max-width: 768px)");
    
    const updateMotionPreference = () => {
      setShouldReduceMotion(prefersReducedMotion.matches || isMobile.matches);
    };

    // Verificar inicialmente
    updateMotionPreference();

    // Ouvir mudanças
    prefersReducedMotion.addEventListener("change", updateMotionPreference);
    isMobile.addEventListener("change", updateMotionPreference);

    return () => {
      prefersReducedMotion.removeEventListener("change", updateMotionPreference);
      isMobile.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  return shouldReduceMotion;
}

/**
 * Hook para detectar apenas preferência de movimento reduzido (não considera mobile)
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook para detectar se é mobile
 */
export function useIsMobileDevice(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
