# 🎨 Animation System Documentation

## Overview

Modern, performant animation system cho Happy Coloring AI - Paint by Numbers Platform.

## 📦 Files Structure

```
frontend/src/
├── utils/
│   └── animations.ts          # Animation variants & configs
├── hooks/
│   └── useAnimations.ts       # Custom animation hooks
└── components/
    └── animated/
        └── index.tsx          # Reusable animated components
```

---

## 🎯 Animation Library (`animations.ts`)

### **Easing Curves**

```typescript
import { EASING } from "@/utils/animations";

// Available easings:
EASING.ease; // Standard [0.25, 0.1, 0.25, 1]
EASING.appleEase; // Apple-style [0.16, 1, 0.3, 1]
EASING.bounce; // Bounce effect [0.68, -0.55, 0.265, 1.55]
EASING.spring; // Elastic spring
EASING.snappy; // Snappy transition
```

### **Basic Animations**

#### Fade Animations

```typescript
import { fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight } from "@/utils/animations";

<motion.div variants={fadeInUp} initial="hidden" animate="visible">
  Content
</motion.div>
```

#### Scale Animations

```typescript
import { scaleIn, scaleInBounce, scaleInSpring } from "@/utils/animations";

<motion.div variants={scaleIn} initial="hidden" whileInView="visible">
  Content
</motion.div>
```

#### Stagger Animations (for lists)

```typescript
import { staggerContainer, staggerItem } from "@/utils/animations";

<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### **Interactive Animations**

#### Card Animations

```typescript
import { cardHover, cardReveal } from "@/utils/animations";

// Hover effect
<motion.div variants={cardHover} initial="rest" whileHover="hover">
  Card content
</motion.div>

// Scroll reveal
<motion.div variants={cardReveal} initial="hidden" whileInView="visible">
  Card content
</motion.div>
```

#### Button Animations

```typescript
import { buttonTap, buttonPulse } from "@/utils/animations";

// Tap effect
<motion.button variants={buttonTap} initial="rest" whileHover="hover" whileTap="tap">
  Click me
</motion.button>

// Pulse effect
<motion.button variants={buttonPulse} initial="rest" whileHover="hover">
  Buy now
</motion.button>
```

#### Badge Animations

```typescript
import { badgePulse, badgeSlideIn } from "@/utils/animations";

<motion.span variants={badgePulse} initial="initial" animate="animate">
  NEW
</motion.span>
```

#### Image Animations

```typescript
import { imageZoom, imageParallax } from "@/utils/animations";

<motion.div variants={imageZoom} initial="rest" whileHover="hover">
  <img src="..." />
</motion.div>
```

### **Modal/Overlay Animations**

```typescript
import { modalOverlay, modalContent, modalSlideUp } from "@/utils/animations";

<AnimatePresence>
  {isOpen && (
    <motion.div variants={modalOverlay} initial="hidden" animate="visible" exit="exit">
      <motion.div variants={modalContent} initial="hidden" animate="visible" exit="exit">
        Modal content
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

### **Preset Combinations**

```typescript
import { heroAnimation, featureAnimation } from "@/utils/animations";

// Hero section
<motion.div variants={heroAnimation} initial="hidden" animate="visible">
  <h1>Welcome</h1>
</motion.div>

// Features with custom delay
<motion.div variants={featureAnimation} custom={index} initial="hidden" animate="visible">
  Feature {index}
</motion.div>
```

---

## 🎣 Animation Hooks (`useAnimations.ts`)

### **Scroll-Triggered Animations**

```typescript
import { useScrollReveal } from "@/hooks/useAnimations";

function Component() {
  const { ref, isInView } = useScrollReveal(true, "-100px");

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
    >
      Content reveals on scroll
    </motion.div>
  );
}
```

### **Parallax Effects**

```typescript
import { useParallax } from "@/hooks/useAnimations";

function Component() {
  const { ref, style } = useParallax(0.5); // speed multiplier

  return (
    <motion.div ref={ref} style={style}>
      Parallax content
    </motion.div>
  );
}
```

### **3D Tilt Effect**

```typescript
import { use3DTilt } from "@/hooks/useAnimations";

function ProductCard() {
  const { handleMouseMove, handleMouseLeave, style } = use3DTilt(10);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      Card with 3D tilt
    </motion.div>
  );
}
```

### **Magnetic Hover**

```typescript
import { useMagneticHover } from "@/hooks/useAnimations";

function MagneticButton() {
  const { handleMouseMove, handleMouseLeave, style } = useMagneticHover(0.3);

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      Magnetic button
    </motion.button>
  );
}
```

### **Viewport Size Detection**

```typescript
import { useViewportSize } from "@/hooks/useAnimations";

function Component() {
  const { width, isMobile, isTablet, isDesktop } = useViewportSize();

  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

### **Reduced Motion Support (Accessibility)**

```typescript
import { usePrefersReducedMotion } from "@/hooks/useAnimations";

function Component() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div animate={prefersReducedMotion ? {} : { scale: 1.1 }}>
      Respects user preferences
    </motion.div>
  );
}
```

---

## 🧩 Reusable Components (`components/animated/index.tsx`)

### **AnimatedButton**

```typescript
import { AnimatedButton } from "@/components/animated";

<AnimatedButton variant="primary" magnetic pulse>
  Click me
</AnimatedButton>

// Variants: 'primary' | 'secondary' | 'outline' | 'ghost'
// Props: magnetic (magnetic hover), pulse (pulse on hover)
```

### **AnimatedCard**

```typescript
import { AnimatedCard } from "@/components/animated";

<AnimatedCard tilt hover onClick={() => {}}>
  Card content
</AnimatedCard>

// Props: tilt (3D tilt), hover (hover effect)
```

### **AnimatedBadge**

```typescript
import { AnimatedBadge } from "@/components/animated";

<AnimatedBadge variant="new" pulse>
  ✨ New
</AnimatedBadge>

// Variants: 'new' | 'sale' | 'hot' | 'custom'
```

### **FadeInWrapper**

```typescript
import { FadeInWrapper } from "@/components/animated";

<FadeInWrapper delay={0.2}>
  Content fades in on scroll
</FadeInWrapper>
```

### **StaggerContainer & StaggerItem**

```typescript
import { StaggerContainer, StaggerItem } from "@/components/animated";

<StaggerContainer staggerDelay={0.1}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      {item.content}
    </StaggerItem>
  ))}
</StaggerContainer>
```

### **GradientText**

```typescript
import { GradientText } from "@/components/animated";

<h1>
  <GradientText>Animated Gradient Text</GradientText>
</h1>
```

### **FloatingElement**

```typescript
import { FloatingElement } from "@/components/animated";

<FloatingElement duration={3} delay={0.5}>
  🎨
</FloatingElement>
```

### **ShineButton**

```typescript
import { ShineButton } from "@/components/animated";

<ShineButton className="bg-primary text-white">
  Hover for shine effect
</ShineButton>
```

---

## 🎬 Usage Examples

### **Homepage Hero Section**

```typescript
import { heroAnimation, buttonTap } from "@/utils/animations";
import { useMagneticHover } from "@/hooks/useAnimations";

function Hero() {
  const magnetic = useMagneticHover(0.25);

  return (
    <motion.div variants={heroAnimation} initial="hidden" animate="visible">
      <h1>Welcome</h1>
      <motion.button
        variants={buttonTap}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onMouseMove={magnetic.handleMouseMove}
        onMouseLeave={magnetic.handleMouseLeave}
        style={magnetic.style}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}
```

### **Product Grid with Stagger**

```typescript
import { staggerContainer, staggerItem } from "@/utils/animations";

function ProductGrid({ products }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      className="grid grid-cols-4 gap-6"
    >
      {products.map(product => (
        <motion.div key={product.id} variants={staggerItem}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### **Product Card with 3D Tilt**

```typescript
import { use3DTilt } from "@/hooks/useAnimations";
import { cardReveal, imageZoom } from "@/utils/animations";

function ProductCard({ product }) {
  const { handleMouseMove, handleMouseLeave, style } = use3DTilt(8);

  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <motion.img
        src={product.image}
        variants={imageZoom}
        initial="rest"
        whileHover="hover"
      />
      <h3>{product.title}</h3>
    </motion.div>
  );
}
```

### **Modal with Backdrop**

```typescript
import { modalOverlay, modalContent } from "@/utils/animations";
import { AnimatePresence } from "framer-motion";

function Modal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            Modal content
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## ✅ Best Practices

### 1. **Performance**

- Use `viewport={{ once: true }}` for scroll animations to trigger only once
- Add `will-change-transform` for better GPU acceleration
- Use `layoutId` for smooth shared element transitions

### 2. **Accessibility**

- Always check `usePrefersReducedMotion()` for motion-sensitive users
- Provide alternative non-animated experiences
- Ensure animations don't interfere with usability

### 3. **Consistency**

- Use animation variants from the library for consistent timing
- Stick to the design system's easing curves
- Maintain similar animation durations across similar elements

### 4. **Stagger Delays**

- Keep stagger delays between 0.05s - 0.15s
- Don't exceed 0.5s total delay for the last item
- Use faster staggers for smaller lists

### 5. **Mobile Optimization**

- Reduce animation complexity on mobile
- Use `useViewportSize()` to conditionally apply animations
- Test on actual devices for performance

---

## 🎨 Animation Inspiration Sources

This animation system is inspired by best practices from:

- **Apple** - Smooth, elegant transitions
- **Nike** - Dynamic, energetic animations
- **Stripe** - Subtle, professional micro-interactions
- **Shopify** - E-commerce focused interactions
- **Airbnb** - Delightful user experiences
- **Awwwards** - Award-winning web animations

---

## 🔧 Customization

### Creating Custom Animations

```typescript
import { Variants } from "framer-motion";
import { EASING } from "@/utils/animations";

export const myCustomAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASING.appleEase },
  },
};
```

### Creating Custom Hooks

```typescript
import { useSpring, useTransform } from "framer-motion";

export function useCustomAnimation() {
  const x = useSpring(0, { stiffness: 400, damping: 30 });
  // Your custom logic
  return { x };
}
```

---

## 📚 Additional Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Best Practices](https://web.dev/animations/)
- [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

---

## 🐛 Troubleshooting

### Animations not working?

1. Check if Framer Motion is installed: `npm list framer-motion`
2. Verify imports are correct
3. Ensure `"use client"` directive is present in Next.js components
4. Check browser console for errors

### Performance issues?

1. Reduce number of simultaneous animations
2. Use `will-change` CSS property sparingly
3. Implement viewport checks to limit animations
4. Consider using CSS animations for simpler cases

### Animations too fast/slow?

- Adjust duration in `transition` prop
- Use different easing curves from `EASING`
- Fine-tune spring physics (stiffness, damping)

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Maintained by:** Happy Coloring AI Team
