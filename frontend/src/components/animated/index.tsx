/**
 * 🎨 Reusable Animated Components
 *
 * Pre-built animated components ready to use across the app
 */

"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import {
  buttonTap,
  buttonPulse,
  cardHover,
  badgePulse,
  fadeInUp,
  scaleIn,
  imageZoom,
} from "@/utils/animations";
import { useMagneticHover, use3DTilt } from "@/hooks/useAnimations";

// ============================================================
// ANIMATED BUTTON (with magnetic hover)
// ============================================================

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "style"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  magnetic?: boolean;
  pulse?: boolean;
  className?: string;
}

export function AnimatedButton({
  children,
  variant = "primary",
  magnetic = false,
  pulse = false,
  className = "",
  ...props
}: AnimatedButtonProps) {
  const magneticEffect = useMagneticHover(magnetic ? 0.2 : 0);

  const baseStyles =
    "px-6 py-3 rounded-full font-bold transition-all duration-300";

  const variants = {
    primary:
      "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
    secondary: "bg-purple-600 text-white shadow-lg hover:bg-purple-700",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary/10",
  };

  return (
    <motion.button
      variants={pulse ? buttonPulse : buttonTap}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onMouseMove={magnetic ? magneticEffect.handleMouseMove : undefined}
      onMouseLeave={magnetic ? magneticEffect.handleMouseLeave : undefined}
      style={magnetic ? magneticEffect.style : undefined}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// ============================================================
// ANIMATED CARD (with 3D tilt)
// ============================================================

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function AnimatedCard({
  children,
  className = "",
  tilt = false,
  hover = true,
  onClick,
}: AnimatedCardProps) {
  const tiltEffect = use3DTilt(tilt ? 8 : 0);

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover={hover ? "hover" : "rest"}
      onMouseMove={tilt ? tiltEffect.handleMouseMove : undefined}
      onMouseLeave={tilt ? tiltEffect.handleMouseLeave : undefined}
      style={tilt ? tiltEffect.style : undefined}
      onClick={onClick}
      className={`rounded-2xl bg-white shadow-sm border border-gray-100 transition-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// ANIMATED BADGE (pulsing badge)
// ============================================================

interface AnimatedBadgeProps {
  children: ReactNode;
  variant?: "new" | "sale" | "hot" | "custom";
  pulse?: boolean;
  className?: string;
}

export function AnimatedBadge({
  children,
  variant = "custom",
  pulse: shouldPulse = true,
  className = "",
}: AnimatedBadgeProps) {
  const variants = {
    new: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    sale: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
    hot: "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
    custom: "",
  };

  return (
    <motion.span
      variants={shouldPulse ? badgePulse : undefined}
      initial={shouldPulse ? "initial" : undefined}
      animate={shouldPulse ? "animate" : undefined}
      className={`text-xs font-bold px-2 py-0.5 rounded-full shadow-sm ${variants[variant]} ${className}`}
    >
      {children}
    </motion.span>
  );
}

// ============================================================
// FADE IN WRAPPER (scroll-triggered fade in)
// ============================================================

interface FadeInWrapperProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeInWrapper({
  children,
  delay = 0,
  className = "",
}: FadeInWrapperProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// SCALE IN WRAPPER (scroll-triggered scale in)
// ============================================================

interface ScaleInWrapperProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ScaleInWrapper({
  children,
  delay = 0,
  className = "",
}: ScaleInWrapperProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// ANIMATED IMAGE (zoom on hover)
// ============================================================

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function AnimatedImage({
  src,
  alt,
  className = "",
}: AnimatedImageProps) {
  return (
    <motion.div
      variants={imageZoom}
      initial="rest"
      whileHover="hover"
      className={`overflow-hidden ${className}`}
    >
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url("${src}")` }}
        role="img"
        aria-label={alt}
      />
    </motion.div>
  );
}

// ============================================================
// FLOATING ELEMENT (subtle float animation)
// ============================================================

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FloatingElement({
  children,
  delay = 0,
  duration = 3,
  className = "",
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// GRADIENT TEXT ANIMATION (animated gradient)
// ============================================================

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export function GradientText({ children, className = "" }: GradientTextProps) {
  return (
    <motion.span
      className={`bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent ${className}`}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% 200%",
      }}
    >
      {children}
    </motion.span>
  );
}

// ============================================================
// STAGGER CONTAINER (for list items)
// ============================================================

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = "",
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// STAGGER ITEM (child of StaggerContainer)
// ============================================================

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// SHINE BUTTON (button with shine effect)
// ============================================================

interface ShineButtonProps extends Omit<HTMLMotionProps<"button">, "style"> {
  children: ReactNode;
  className?: string;
}

export function ShineButton({
  children,
  className = "",
  ...props
}: ShineButtonProps) {
  return (
    <motion.button
      variants={buttonTap}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={`relative overflow-hidden px-6 py-3 rounded-full font-bold ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// ============================================================
// RIPPLE BUTTON (button with ripple effect on click)
// ============================================================

interface RippleButtonProps extends Omit<HTMLMotionProps<"button">, "style"> {
  children: ReactNode;
  className?: string;
}

export function RippleButton({
  children,
  className = "",
  ...props
}: RippleButtonProps) {
  return (
    <motion.button
      variants={buttonTap}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={`relative overflow-hidden px-6 py-3 rounded-full font-bold ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Export all components
export default {
  AnimatedButton,
  AnimatedCard,
  AnimatedBadge,
  FadeInWrapper,
  ScaleInWrapper,
  AnimatedImage,
  FloatingElement,
  GradientText,
  StaggerContainer,
  StaggerItem,
  ShineButton,
  RippleButton,
};
