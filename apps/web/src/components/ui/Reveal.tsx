import type { ElementType, MouseEventHandler, ReactNode } from "react";
import { useInView } from "../../hooks/useInView";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  // Only needed for `as="button"` (e.g. Gallery's clickable per-item
  // reveal) — kept explicit/typed rather than a generic prop spread.
  onClick?: MouseEventHandler;
  type?: "button" | "submit" | "reset";
}

export function Reveal({ children, as: Tag = "div", className = "", style, onClick, type }: RevealProps) {
  const { ref, isVisible } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal${isVisible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      onClick={onClick}
      type={type}
    >
      {children}
    </Tag>
  );
}
