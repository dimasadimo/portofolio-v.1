import { useEffect, useRef, useState } from "react";

export const CursorBorder = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const circleInnerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const circleRefPos = useRef({ x: -100, y: -100 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch/mobile devices
    const touchQuery = window.matchMedia("(pointer: coarse)");
    setIsTouch(touchQuery.matches);
    if (touchQuery.matches) return;

    let hasMoved = false;
    let isOverInput = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      if (!hasMoved) {
        hasMoved = true;
        // Instantly position them so there is no sudden jump from (-100, -100)
        circleRefPos.current.x = e.clientX;
        circleRefPos.current.y = e.clientY;
        if (dotRef.current && !isOverInput) dotRef.current.style.opacity = "1";
        if (circleRef.current && !isOverInput) circleRef.current.style.opacity = "1";
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Handle text input fields
      const isTextInput = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.closest('input') || 
        target.closest('textarea') ||
        target.isContentEditable;

      if (isTextInput) {
        isOverInput = true;
        if (dotRef.current) dotRef.current.style.opacity = "0";
        if (circleRef.current) circleRef.current.style.opacity = "0";
        return;
      } else if (isOverInput) {
        isOverInput = false;
        if (hasMoved) {
          if (dotRef.current) dotRef.current.style.opacity = "1";
          if (circleRef.current) circleRef.current.style.opacity = "1";
        }
      }

      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.cursor-pointer');

      if (isClickable) {
        if (circleInnerRef.current) {
          circleInnerRef.current.classList.add("scale-150", "border-orange", "bg-orange/10");
          circleInnerRef.current.classList.remove("border-gray-400/40");
        }
        if (dotInnerRef.current) {
          dotInnerRef.current.classList.add("scale-50", "opacity-50");
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const relatedTarget = e.relatedTarget as HTMLElement | null;
      
      const wasClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.cursor-pointer');

      const isEnteringClickable = relatedTarget && (
        relatedTarget.tagName === 'A' || 
        relatedTarget.tagName === 'BUTTON' || 
        relatedTarget.closest('a') || 
        relatedTarget.closest('button') || 
        relatedTarget.closest('.cursor-pointer')
      );

      if (wasClickable && !isEnteringClickable) {
        if (circleInnerRef.current) {
          circleInnerRef.current.classList.remove("scale-150", "border-orange", "bg-orange/10");
          circleInnerRef.current.classList.add("border-gray-400/40");
        }
        if (dotInnerRef.current) {
          dotInnerRef.current.classList.remove("scale-50", "opacity-50");
        }
      }
    };

    const handleMouseDown = () => {
      if (circleInnerRef.current) {
        circleInnerRef.current.classList.add("scale-75");
      }
      if (dotInnerRef.current) {
        dotInnerRef.current.classList.add("scale-150");
      }
    };

    const handleMouseUp = () => {
      if (circleInnerRef.current) {
        circleInnerRef.current.classList.remove("scale-75");
      }
      if (dotInnerRef.current) {
        dotInnerRef.current.classList.remove("scale-150");
      }
    };

    const handleMouseLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (circleRef.current) circleRef.current.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      if (hasMoved && !isOverInput) {
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (circleRef.current) circleRef.current.style.opacity = "1";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let animationFrameId: number;

    const tick = () => {
      if (hasMoved) {
        const targetX = mouseRef.current.x;
        const targetY = mouseRef.current.y;

        circleRefPos.current.x += (targetX - circleRefPos.current.x) * 0.28;
        circleRefPos.current.y += (targetY - circleRefPos.current.y) * 0.28;

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        }

        if (circleRef.current) {
          circleRef.current.style.transform = `translate3d(${circleRefPos.current.x}px, ${circleRefPos.current.y}px, 0)`;
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
        input, textarea, [contenteditable] {
          cursor: auto !important;
        }
      `}</style>
      
      {/* Outer Circle Container (Positioned by JS) */}
      <div
        ref={circleRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 will-change-transform"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
        }}
      >
        {/* Inner Circle Element (Scaled and colored by CSS transitions) */}
        <div
          ref={circleInnerRef}
          className="w-8 h-8 -ml-4 -mt-4 border border-gray-400/40 rounded-full transition-all duration-200 ease-out"
        />
      </div>

      {/* Inner Dot Container (Positioned by JS) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] opacity-0 will-change-transform"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
        }}
      >
        {/* Inner Dot Element (Scaled by CSS transitions) */}
        <div
          ref={dotInnerRef}
          className="w-1.5 h-1.5 -ml-0.75 -mt-0.75 bg-orange rounded-full transition-all duration-200 ease-out"
        />
      </div>
    </>
  );
};