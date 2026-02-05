import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
  type?: "fade" | "scale" | "slide" | "hybrid";
}

const directionVariants = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
  none: { x: 0, y: 0 },
};

export function ScrollAnimation({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
  type = "fade",
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });
  const reduceMotion = useReducedMotion();

  // Se deve reduzir movimento, renderizar sem animação
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const initialPosition = directionVariants[direction];

  const getInitialState = () => {
    switch (type) {
      case "scale":
        return { opacity: 0, scale: 0.95 };
      case "hybrid":
        return { opacity: 0, scale: 0.98, ...initialPosition };
      default:
        return { opacity: 0, ...initialPosition };
    }
  };

  const getAnimateState = () => {
    switch (type) {
      case "scale":
        return { opacity: 1, scale: 1 };
      case "hybrid":
        return { opacity: 1, scale: 1, x: 0, y: 0 };
      default:
        return { opacity: 1, x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={isInView ? getAnimateState() : getInitialState()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduceMotion = useReducedMotion();

  // Se deve reduzir movimento, renderizar sem animação
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  type = "slide",
}: {
  children: ReactNode;
  className?: string;
  type?: "slide" | "scale" | "hybrid";
}) {
  const reduceMotion = useReducedMotion();

  // Se deve reduzir movimento, renderizar sem animação
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    hidden: { 
      opacity: 0, 
      y: type === "slide" || type === "hybrid" ? 20 : 0,
      scale: type === "scale" || type === "hybrid" ? 0.95 : 1,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

// Parallax component for hero sections - Disabled on mobile for performance
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export function Parallax({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
}: ParallaxProps) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed * multiplier]);

  // Desabilitar parallax em mobile/reduced motion para performance
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Animated icon component with entrance animation
interface AnimatedIconProps {
  children: ReactNode;
  className?: string;
  type?: "bounce" | "rotate" | "pulse" | "float";
  delay?: number;
}

export function AnimatedIcon({
  children,
  className = "",
  type = "bounce",
  delay = 0,
}: AnimatedIconProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduceMotion = useReducedMotion();

  // Se deve reduzir movimento, renderizar sem animação
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getAnimation = () => {
    switch (type) {
      case "rotate":
        return { rotate: [0, -10, 10, 0], transition: { duration: 0.6, delay } };
      case "pulse":
        return { scale: [1, 1.1, 1], transition: { duration: 0.5, delay } };
      case "float":
        // Removido repeat: Infinity para melhor performance
        return { y: [0, -5, 0], transition: { duration: 0.8, delay } };
      default:
        return { y: [0, -8, 0], transition: { duration: 0.4, delay } };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1, ...getAnimation() } : { opacity: 0, scale: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hover lift effect for cards and buttons - CSS-based for better performance
interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  lift?: number;
  scale?: number;
}

export function HoverLift({ 
  children, 
  className = "", 
}: HoverLiftProps) {
  // Usando CSS transitions ao invés de Framer Motion para melhor performance
  return (
    <div
      className={`relative transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] ${className}`}
      style={{ zIndex: 1 }}
    >
      {children}
    </div>
  );
}
