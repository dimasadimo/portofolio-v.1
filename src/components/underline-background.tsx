'use client';

import { motion, type ValueAnimationTransition } from 'motion/react';
import {
  type ElementType,
  type HTMLAttributes,
  type RefAttributes,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { cn } from '@/lib/utils';

interface UnderlineProps {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode;

  /**
   * HTML Tag to render the component as
   * @default span
   */
  as?: ElementType<HTMLAttributes<HTMLElement> & RefAttributes<HTMLElement>>;

  /**
   * Optional class name for styling
   */
  className?: string;

  /**
   * Animation transition configuration
   * @default { type: "spring", damping: 30, stiffness: 300 }
   */
  transition?: ValueAnimationTransition;

  /**
   * The color that the text will animate to on hover
   */
  targetTextColor: string;

  /**
   * Height of the underline as a ratio of font size
   * @default 0.1
   */
  underlineHeightRatio?: number;

  /**
   * Padding of the underline as a ratio of font size
   * @default 0.01
   */
  underlinePaddingRatio?: number;
}

const UnderlineToBackground = ({
  children,
  as,
  className,
  transition = { type: 'spring', damping: 30, stiffness: 300 },
  underlineHeightRatio = 0.1, // Default to 10% of font size
  underlinePaddingRatio = 0.01, // Default to 1% of font size
  targetTextColor = '#fef',
  ...props
}: UnderlineProps) => {
  const textRef = useRef<HTMLElement>(null);

  // Create custom motion component based on the 'as' prop
  const MotionComponent = useMemo(() => motion.create(as ?? 'span'), [as]);

  // Update CSS custom properties based on font size
  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (textRef.current) {
        const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize);
        const underlineHeight = fontSize * underlineHeightRatio;
        const underlinePadding = fontSize * underlinePaddingRatio;
        textRef.current.style.setProperty('--underline-height', `${underlineHeight}px`);
        textRef.current.style.setProperty('--underline-padding', `${underlinePadding}px`);
      }
    };

    updateUnderlineStyles();
    window.addEventListener('resize', updateUnderlineStyles);

    return () => window.removeEventListener('resize', updateUnderlineStyles);
  }, [underlineHeightRatio, underlinePaddingRatio]);

  // Animation variants for the underline background
  const underlineVariants = {
    initial: {
      height: 'var(--underline-height)',
    },
    target: {
      height: '100%',
      transition: transition,
    },
  };

  return (
    <MotionComponent
      className={cn('group relative inline-block cursor-pointer', className)}
      // The hover colour is a CSS custom property, not a motion value. Animating
      // `color` makes motion resolve `currentColor` to a fixed rgb() and leave it
      // inline, which then survives a theme change and shows the wrong colour.
      style={{ '--underline-target-color': targetTextColor } as React.CSSProperties}
      whileHover="target"
      ref={textRef}
      {...props}
    >
      {/* A span, not a div: this renders inside <p> and a div there is invalid HTML
          (the browser relocates it, which breaks hydration). `block` keeps the layout. */}
      <motion.span
        className="absolute block w-full bg-current"
        style={{
          height: 'var(--underline-height)',
          bottom: 'calc(-1 * var(--underline-padding))',
        }}
        variants={underlineVariants}
        aria-hidden="true"
      />
      <span className="relative text-current transition-colors duration-300 group-hover:text-[var(--underline-target-color)]">
        {children}
      </span>
    </MotionComponent>
  );
};

UnderlineToBackground.displayName = 'UnderlineToBackground';

export default UnderlineToBackground;
