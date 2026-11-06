"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroPrimaryButtonProps {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
  variant?: "dark" | "light" | "blue";
  size?: "md" | "lg";
}

export function HeroPrimaryButton({
  href = "#tarification",
  onClick,
  children,
  className = "",
  showArrow = true,
  variant = "dark",
  size = "lg",
}: HeroPrimaryButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 650);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const variantClasses = {
    dark: "bg-slate-900 text-white hover:bg-slate-800",
    light: "bg-white text-slate-950 hover:bg-slate-100 border border-slate-200",
    blue: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20",
  }[variant];

  const sizeClasses = {
    md: "px-5 py-2.5 text-xs uppercase tracking-wider rounded-full",
    lg: "px-8 py-4 text-base rounded-xl",
  }[size];

  const combinedClasses = `hero-primary-btn group ${variantClasses} ${sizeClasses} ${className}`;

  const innerContent = (
    <>
      <span className="relative z-10 font-bold">{children}</span>
      {showArrow && (
        <ArrowRight className="w-5 h-5 relative z-10 hero-btn-arrow transition-transform group-hover:translate-x-1" />
      )}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="btn-ripple"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
          }}
        />
      ))}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={buttonRef as any}
        onClick={handleClick}
        className={combinedClasses}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef as any}
      onClick={handleClick}
      type="button"
      className={combinedClasses}
    >
      {innerContent}
    </button>
  );
}

