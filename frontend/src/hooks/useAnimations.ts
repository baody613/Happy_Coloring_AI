/**
 * 🎨 Custom Animation Hooks
 *
 * React hooks for easy animation integration
 */

import { useRef, useEffect, useState } from "react";
import {
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

// ============================================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================================

/**
 * Hook for scroll-triggered animations with IntersectionObserver
 *
 * @param once - If true, animation triggers only once
 * @param margin - Margin for intersection detection (default: "-100px")
 * @returns { ref, isInView }
 */
export function useScrollReveal(
  once: boolean = true,
  margin: string = "-100px",
) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin });

  return { ref, isInView };
}

/**
 * Hook for multiple scroll-triggered animations
 * Useful for sections with multiple animated elements
 */
export function useStaggerReveal(count: number, once: boolean = true) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [inViewStates, setInViewStates] = useState<boolean[]>(
    new Array(count).fill(false),
  );

  useEffect(() => {
    refs.current = refs.current.slice(0, count);
  }, [count]);

  return {
    refs,
    getRef: (index: number) => (el: HTMLElement | null) => {
      refs.current[index] = el;
    },
    inViewStates,
  };
}

// ============================================================
// PARALLAX EFFECTS
// ============================================================

/**
 * Hook for parallax scrolling effect
 *
 * @param speed - Speed multiplier (0.5 = slow, 1.5 = fast)
 * @returns { ref, style } - Apply style to the element
 */
export function useParallax(speed: number = 0.5) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return { ref, style: { y } };
}

/**
 * Hook for smooth parallax with spring physics
 */
export function useSmoothParallax(
  speed: number = 0.5,
  stiffness: number = 100,
  damping: number = 30,
) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const y = useSpring(rawY, { stiffness, damping });

  return { ref, style: { y } };
}

// ============================================================
// 3D TILT EFFECT (Like on product cards)
// ============================================================

/**
 * Hook for 3D tilt effect on mouse move
 * Perfect for product cards
 */
export function use3DTilt(maxTilt: number = 10) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const boundsRef = useRef<DOMRect | null>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef<{ clientX: number; clientY: number } | null>(null);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 400,
    damping: 30,
  });

  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 400,
    damping: 30,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    boundsRef.current ??= event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
    };

    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      const bounds = boundsRef.current;
      const pointer = pointerRef.current;
      frameRef.current = null;

      if (!bounds || !pointer) return;

      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      x.set((pointer.clientX - centerX) / bounds.width);
      y.set((pointer.clientY - centerY) / bounds.height);
    });
  };

  const handleMouseLeave = () => {
    boundsRef.current = null;
    pointerRef.current = null;
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return {
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
    style: { rotateX, rotateY, transformPerspective: 1000 },
  };
}

// ============================================================
// MAGNETIC HOVER EFFECT (Like modern buttons)
// ============================================================

/**
 * Hook for magnetic cursor effect
 * Element follows cursor when nearby
 */
export function useMagneticHover(strength: number = 0.3) {
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (event.clientX - centerX) * strength;
    const deltaY = (event.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    x,
    y,
    handleMouseMove,
    handleMouseLeave,
    style: { x, y },
  };
}

// ============================================================
// PROGRESSIVE LOADING (Stagger effect for lists)
// ============================================================

/**
 * Hook to calculate stagger delay for list items
 *
 * @param index - Item index in the list
 * @param baseDelay - Base delay in seconds
 * @returns delay value
 */
export function useStaggerDelay(index: number, baseDelay: number = 0.1) {
  return index * baseDelay;
}

// ============================================================
// SCROLL PROGRESS (For progress bars, indicators)
// ============================================================

/**
 * Hook for tracking scroll progress of an element
 * Returns 0-1 value
 */
export function useScrollProgress() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return { ref, scrollYProgress };
}

/**
 * Hook for page scroll progress (0-100%)
 */
export function usePageScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return { scrollYProgress, scaleX };
}

// ============================================================
// SMOOTH SCROLL (For anchor links)
// ============================================================

/**
 * Hook for smooth scroll to element
 */
export function useSmoothScroll() {
  const scrollTo = (elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const top =
      element.getBoundingClientRect().top + window.pageYOffset + offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  return { scrollTo };
}

// ============================================================
// VIEWPORT SIZE (Responsive animations)
// ============================================================

/**
 * Hook to detect viewport size and adjust animations
 */
export function useViewportSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    ...size,
    isMobile: size.width < 768,
    isTablet: size.width >= 768 && size.width < 1024,
    isDesktop: size.width >= 1024,
  };
}

// ============================================================
// REDUCED MOTION (Accessibility)
// ============================================================

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

// ============================================================
// HOVER STATE (For complex hover interactions)
// ============================================================

/**
 * Hook to track hover state with enter/leave delays
 */
export function useHoverWithDelay(
  enterDelay: number = 0,
  leaveDelay: number = 0,
) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, enterDelay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, leaveDelay);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return { isHovered, handleMouseEnter, handleMouseLeave };
}

// ============================================================
// INTERSECTION RATIO (For progressive reveals)
// ============================================================

/**
 * Hook to get intersection ratio (0-1) of an element
 */
export function useIntersectionRatio() {
  const ref = useRef(null);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setRatio(entry.intersectionRatio);
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, ratio };
}

export default {
  useScrollReveal,
  useStaggerReveal,
  useParallax,
  useSmoothParallax,
  use3DTilt,
  useMagneticHover,
  useStaggerDelay,
  useScrollProgress,
  usePageScrollProgress,
  useSmoothScroll,
  useViewportSize,
  usePrefersReducedMotion,
  useHoverWithDelay,
  useIntersectionRatio,
};
