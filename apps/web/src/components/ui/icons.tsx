import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number, props: IconProps) {
  return { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", ...props };
}

export const ClockIcon = ({ size = 14, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

export const PhoneIcon = ({ size = 14, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const WhatsAppIcon = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12.04 2.003c-5.52 0-9.99 4.47-9.99 9.99 0 1.76.46 3.48 1.34 4.99L2 22l5.16-1.35a9.96 9.96 0 0 0 4.88 1.24h.01c5.52 0 9.99-4.47 9.99-9.99 0-2.67-1.04-5.18-2.93-7.07a9.94 9.94 0 0 0-7.07-2.83Zm5.86 14.1c-.25.7-1.45 1.34-2 1.42-.51.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.68-.63-2.96-1.28-4.89-4.24-5.04-4.44-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.6.85 2.08.92 2.23.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.3.76 1.28 1.64 2.07 1.13 1.02 2.08 1.34 2.37 1.49.29.15.46.13.63-.08.17-.2.72-.85.91-1.14.19-.29.38-.24.63-.14.25.1 1.62.79 1.9.93.28.14.46.21.53.33.07.12.07.68-.18 1.36Z" />
  </svg>
);

export const ChevronDownIcon = ({ size = 14, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2.4}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const CheckIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2.6}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const PinIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const ShieldIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
);

export const InvoiceIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 3H8a1 1 0 0 0-1 1v3h10V4a1 1 0 0 0-1-1Z" />
  </svg>
);

export const TeamIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const HeartHandsIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
  </svg>
);

export const FlexIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M12 20v-6M12 14l6.16-3.42a2 2 0 0 0 1.03-1.75V6.5M12 14 5.84 10.58a2 2 0 0 1-1.03-1.75V6.5M12 14v0M7.5 4.27 12 7l4.5-2.73M3.27 6.96 12 12l8.73-5.04M12 22.08V12" />
  </svg>
);

export const ArrowRightIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2.4}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const CloseIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2.4}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const MailIcon = ({ size = 15, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

export const FacebookIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const InstagramIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" />
  </svg>
);

export const TikTokIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M16 8v8a4 4 0 1 1-4-4" />
    <path d="M12 4c0 2.5 2 4.5 4.5 4.5V12" />
  </svg>
);

export const LinkedInIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
    <path d="M10 9v12M10 13a4 4 0 0 1 8 0v8" />
  </svg>
);
