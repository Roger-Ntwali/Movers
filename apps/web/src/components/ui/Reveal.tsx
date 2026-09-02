import type { ElementType, ReactNode } from "react";
import { useInView } from "../../hooks/useInView";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function Reveal({ children, as: Tag = "div", className = "", style }: RevealProps) {
  const { ref, isVisible } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal${isVisible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
