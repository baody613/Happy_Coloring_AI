/**
 * 🎨 Happy Coloring AI - Modern Animation Library
 *
 * Collection of reusable animation variants and utilities
 * for creating smooth, delightful user experiences.
 *
 * Inspired by: Apple, Nike, Stripe, Shopify, Airbnb, Awwwards
 */

import { Variants, Transition } from "framer-motion";

// ============================================================
// EASING CURVES (Custom bezier curves for smooth animations)
// ============================================================

export const EASING = {
  // Standard easing
  ease: [0.25, 0.1, 0.25, 1],

  // Apple-style smooth ease
  appleEase: [0.16, 1, 0.3, 1],

  // Bounce effect
  bounce: [0.68, -0.55, 0.265, 1.55],

  // Elastic spring
  spring: { type: "spring", stiffness: 100, damping: 15 },

  // Snappy transition
  snappy: { type: "spring", stiffness: 400, damping: 30 },
} as const;

// ============================================================
// FADE ANIMATIONS (Entry/exit fades with various directions)
// ============================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: EASING.ease },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASING.appleEase },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASING.appleEase },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASING.appleEase },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASING.appleEase },
  },
};

// ============================================================
// SCALE ANIMATIONS (Zoom in/out effects)
// ============================================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASING.appleEase },
  },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASING.bounce },
  },
};

export const scaleInSpring: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: EASING.spring,
  },
};

// ============================================================
// STAGGER ANIMATIONS (Sequential reveals for lists/grids)
// ============================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerFastContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASING.appleEase },
  },
};

// ============================================================
// CARD ANIMATIONS (Product cards, content cards)
// ============================================================

export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    scale: 1.02,
    y: -8,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3, ease: EASING.appleEase },
  },
};

export const cardTilt: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
};

// ============================================================
// 3D EFFECTS (Subtle 3D transforms on hover)
// ============================================================

export const lift3D: Variants = {
  rest: {
    rotateX: 0,
    z: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    rotateX: 5,
    z: 50,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: { duration: 0.3, ease: EASING.ease },
  },
};

// ============================================================
// BUTTON ANIMATIONS (CTA buttons, action buttons)
// ============================================================

export const buttonTap: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

export const buttonShine = {
  rest: { backgroundPosition: "200% center" },
  hover: {
    backgroundPosition: "-200% center",
    transition: { duration: 1.5, ease: "linear" },
  },
};

export const buttonPulse: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ============================================================
// IMAGE ANIMATIONS (Product images, gallery images)
// ============================================================

export const imageZoom: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: { duration: 0.5, ease: EASING.ease },
  },
};

export const imageParallax: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.05,
    y: -10,
    transition: { duration: 0.4, ease: EASING.ease },
  },
};

// ============================================================
// REVEAL ANIMATIONS (Scroll-triggered reveals)
// ============================================================

export const revealUp: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASING.appleEase },
  },
};

export const revealLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASING.appleEase },
  },
};

export const revealRight: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASING.appleEase },
  },
};

// ============================================================
// BADGE ANIMATIONS (New, Sale, Hot badges)
// ============================================================

export const badgePulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const badgeSlideIn: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.8 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: EASING.bounce,
      delay: 0.3,
    },
  },
};

// ============================================================
// MODAL ANIMATIONS (Dialogs, overlays, quick views)
// ============================================================

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASING.appleEase,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

export const modalSlideUp: Variants = {
  hidden: {
    opacity: 0,
    y: "100%",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASING.appleEase,
    },
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: { duration: 0.3 },
  },
};

// ============================================================
// LOADING ANIMATIONS (Spinners, skeletons, loaders)
// ============================================================

export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const pulse: Variants = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const skeletonShimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// ============================================================
// PAGE TRANSITION ANIMATIONS
// ============================================================

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASING.appleEase },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export const pageFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// ============================================================
// NOTIFICATION ANIMATIONS (Toasts, alerts, badges)
// ============================================================

export const slideInRight: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: EASING.appleEase },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export const slideInTop: Variants = {
  hidden: { y: "-100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: EASING.appleEase },
  },
  exit: {
    y: "-100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Create a stagger container with custom timing
 */
export const createStaggerContainer = (
  staggerDelay: number = 0.1,
  delayChildren: number = 0,
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

/**
 * Create a fade in with custom delay
 */
export const createFadeIn = (delay: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay, ease: EASING.ease },
  },
});

/**
 * Create a scroll-triggered reveal with custom direction
 */
export const createScrollReveal = (
  direction: "up" | "down" | "left" | "right" = "up",
  distance: number = 50,
): Variants => {
  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const value =
    direction === "down" || direction === "right" ? distance : -distance;

  return {
    hidden: {
      opacity: 0,
      [axis]: value,
    },
    visible: {
      opacity: 1,
      [axis]: 0,
      transition: { duration: 0.7, ease: EASING.appleEase },
    },
  };
};

/**
 * Parallax effect configuration for scroll-based parallax
 */
export const parallaxConfig = {
  slow: { speed: 0.5 }, // Moves slower than scroll
  normal: { speed: 1 }, // Moves with scroll
  fast: { speed: 1.5 }, // Moves faster than scroll
};

// ============================================================
// HOVER EFFECTS (For interactive elements)
// ============================================================

export const hoverScale = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

export const hoverGlow = {
  rest: {
    boxShadow: "0 0 0 rgba(217, 136, 185, 0)",
  },
  hover: {
    boxShadow: "0 0 20px rgba(217, 136, 185, 0.5)",
    transition: { duration: 0.3 },
  },
};

export const hoverRotate = {
  rest: { rotate: 0 },
  hover: { rotate: 5, transition: { duration: 0.2 } },
};

// ============================================================
// PRESET COMBINATIONS (Common animation patterns)
// ============================================================

/**
 * Card reveal animation (for product cards, content cards)
 */
export const cardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASING.appleEase },
  },
};

/**
 * Hero section animation (for main headings, CTAs)
 */
export const heroAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASING.appleEase, delay: 0.2 },
  },
};

/**
 * Feature section animation (for feature lists, benefits)
 */
export const featureAnimation: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: EASING.appleEase,
    },
  }),
};

export default {
  // Easing
  EASING,

  // Basic
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,

  // Scale
  scaleIn,
  scaleInBounce,
  scaleInSpring,

  // Stagger
  staggerContainer,
  staggerFastContainer,
  staggerItem,

  // Cards
  cardHover,
  cardTilt,
  cardReveal,

  // 3D
  lift3D,

  // Buttons
  buttonTap,
  buttonShine,
  buttonPulse,

  // Images
  imageZoom,
  imageParallax,

  // Reveals
  revealUp,
  revealLeft,
  revealRight,

  // Badges
  badgePulse,
  badgeSlideIn,

  // Modals
  modalOverlay,
  modalContent,
  modalSlideUp,

  // Loading
  spin,
  pulse,
  skeletonShimmer,

  // Pages
  pageTransition,
  pageFade,

  // Notifications
  slideInRight,
  slideInTop,

  // Hover
  hoverScale,
  hoverGlow,
  hoverRotate,

  // Presets
  heroAnimation,
  featureAnimation,

  // Utilities
  createStaggerContainer,
  createFadeIn,
  createScrollReveal,
  parallaxConfig,
};
