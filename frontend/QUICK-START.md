# 🚀 Animation System - Quick Start Guide

## 🎯 Mục Đích

Hướng dẫn nhanh cách sử dụng animation system mới cho Happy Coloring AI.

---

## 📦 Files Đã Tạo

```
frontend/
├── src/
│   ├── utils/
│   │   └── animations.ts          ← Animation variants & configs
│   ├── hooks/
│   │   └── useAnimations.ts       ← Custom animation hooks
│   └── components/
│       └── animated/
│           └── index.tsx          ← Reusable components
├── ANIMATIONS.md                  ← Full documentation
└── ANIMATION-REPORT.md            ← Completion report
```

---

## ⚡ Quick Examples

### 1️⃣ **Simple Fade In (Easiest)**

```tsx
import { FadeInWrapper } from "@/components/animated";

<FadeInWrapper delay={0.2}>
  <h1>This fades in on scroll</h1>
</FadeInWrapper>;
```

### 2️⃣ **Animated Button**

```tsx
import { AnimatedButton } from "@/components/animated";

<AnimatedButton
  variant="primary" // primary | secondary | outline | ghost
  magnetic={true} // Magnetic hover effect
  pulse={false} // Pulse on hover
  onClick={handleClick}
>
  Click Me!
</AnimatedButton>;
```

### 3️⃣ **3D Tilt Card** (Like on Gallery)

```tsx
import { AnimatedCard } from "@/components/animated";

<AnimatedCard tilt hover onClick={handleClick}>
  <img src="product.jpg" />
  <h3>Product Title</h3>
  <p>Description</p>
</AnimatedCard>;
```

### 4️⃣ **Pulsing Badge**

```tsx
import { AnimatedBadge } from "@/components/animated";

<AnimatedBadge variant="new" pulse>
  ✨ NEW
</AnimatedBadge>

<AnimatedBadge variant="sale" pulse>
  🏷️ -30%
</AnimatedBadge>
```

### 5️⃣ **List with Stagger Animation**

```tsx
import { StaggerContainer, StaggerItem } from "@/components/animated";

<StaggerContainer staggerDelay={0.1}>
  {products.map((product) => (
    <StaggerItem key={product.id}>
      <ProductCard product={product} />
    </StaggerItem>
  ))}
</StaggerContainer>;
```

### 6️⃣ **Gradient Animated Text**

```tsx
import { GradientText } from "@/components/animated";

<h1>
  <GradientText>Beautiful Animated Text</GradientText>
</h1>;
```

### 7️⃣ **Floating Element**

```tsx
import { FloatingElement } from "@/components/animated";

<FloatingElement duration={3} delay={0}>
  🎨 <!-- This floats up and down -->
</FloatingElement>
```

---

## 🎨 Advanced Usage

### **Custom Animation with Variants**

```tsx
import { motion } from "framer-motion";
import { fadeInUp, buttonTap } from "@/utils/animations";

<motion.div
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  <motion.button
    variants={buttonTap}
    initial="rest"
    whileHover="hover"
    whileTap="tap"
  >
    Click me
  </motion.button>
</motion.div>;
```

### **3D Tilt with Custom Hook**

```tsx
import { use3DTilt } from "@/hooks/useAnimations";
import { motion } from "framer-motion";

function MyCard() {
  const { handleMouseMove, handleMouseLeave, style } = use3DTilt(10);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className="card"
    >
      Card content with 3D tilt
    </motion.div>
  );
}
```

### **Magnetic Button**

```tsx
import { useMagneticHover } from "@/hooks/useAnimations";
import { motion } from "framer-motion";
import { buttonTap } from "@/utils/animations";

function MagneticCTA() {
  const { handleMouseMove, handleMouseLeave, style } = useMagneticHover(0.3);

  return (
    <motion.button
      variants={buttonTap}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className="btn-primary"
    >
      Hover over me!
    </motion.button>
  );
}
```

---

## 🎬 Animation Variants Cheat Sheet

### **Fade Animations**

```tsx
(fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight);
```

### **Scale Animations**

```tsx
(scaleIn, scaleInBounce, scaleInSpring);
```

### **Card Animations**

```tsx
(cardHover, cardTilt, cardReveal);
```

### **Button Animations**

```tsx
(buttonTap, buttonPulse, buttonShine);
```

### **Badge Animations**

```tsx
(badgePulse, badgeSlideIn);
```

### **Image Animations**

```tsx
(imageZoom, imageParallax);
```

### **Modal Animations**

```tsx
(modalOverlay, modalContent, modalSlideUp);
```

---

## 📱 Responsive Animations

### **Check Viewport Size**

```tsx
import { useViewportSize } from "@/hooks/useAnimations";

function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop } = useViewportSize();

  return (
    <motion.div animate={isMobile ? { scale: 1 } : { scale: 1.1 }}>
      Content
    </motion.div>
  );
}
```

---

## ♿ Accessibility

### **Respect User Preferences**

```tsx
import { usePrefersReducedMotion } from "@/hooks/useAnimations";

function AccessibleAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div animate={prefersReducedMotion ? {} : { scale: 1.1, rotate: 5 }}>
      Content respects motion preferences
    </motion.div>
  );
}
```

---

## 🎯 Common Use Cases

### **Product Card**

```tsx
import { AnimatedCard } from "@/components/animated";
import { motion } from "framer-motion";
import { imageZoom } from "@/utils/animations";

<AnimatedCard tilt hover>
  <motion.img
    src={product.image}
    variants={imageZoom}
    initial="rest"
    whileHover="hover"
  />
  <h3>{product.title}</h3>
  <p>{product.price}</p>
</AnimatedCard>;
```

### **CTA Button**

```tsx
import { AnimatedButton } from "@/components/animated";

<AnimatedButton
  variant="primary"
  magnetic
  onClick={() => navigate("/checkout")}
>
  Buy Now 🛒
</AnimatedButton>;
```

### **Feature List**

```tsx
import { StaggerContainer, StaggerItem } from "@/components/animated";

<StaggerContainer>
  {features.map((feature, i) => (
    <StaggerItem key={i}>
      <div className="feature">
        <span>{feature.icon}</span>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    </StaggerItem>
  ))}
</StaggerContainer>;
```

### **Hero Section**

```tsx
import { motion } from "framer-motion";
import { heroAnimation } from "@/utils/animations";
import { AnimatedButton } from "@/components/animated";

<motion.section variants={heroAnimation} initial="hidden" animate="visible">
  <h1>Welcome to Happy Coloring AI</h1>
  <p>Create beautiful paint-by-numbers</p>
  <AnimatedButton variant="primary" magnetic>
    Get Started
  </AnimatedButton>
</motion.section>;
```

---

## 🔧 Customization

### **Create Custom Animation**

```tsx
import { Variants } from "framer-motion";
import { EASING } from "@/utils/animations";

const myAnimation: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASING.appleEase },
  },
};

<motion.div variants={myAnimation} initial="hidden" animate="visible">
  Custom animation
</motion.div>;
```

---

## 📚 Learn More

- **Full Documentation**: `frontend/ANIMATIONS.md`
- **Completion Report**: `frontend/ANIMATION-REPORT.md`
- **Source Code**:
  - `frontend/src/utils/animations.ts`
  - `frontend/src/hooks/useAnimations.ts`
  - `frontend/src/components/animated/index.tsx`

---

## 🎊 Summary

### **Pre-built Components** (Easiest)

- `AnimatedButton`
- `AnimatedCard`
- `AnimatedBadge`
- `FadeInWrapper`
- `StaggerContainer` + `StaggerItem`
- `GradientText`
- `FloatingElement`

### **Animation Variants** (Flexible)

- Import from `@/utils/animations`
- Use with `<motion.div variants={...}>`

### **Custom Hooks** (Advanced)

- `use3DTilt`
- `useMagneticHover`
- `useScrollReveal`
- `useParallax`

---

## 🚀 Get Started Now!

1. **Simple**: Use pre-built components
2. **Custom**: Import animation variants
3. **Advanced**: Use custom hooks
4. **Documentation**: Read `ANIMATIONS.md`

---

**Happy animating! ✨**

Nếu cần hỗ trợ, check `ANIMATIONS.md` hoặc xem source code trong các files đã tạo.
