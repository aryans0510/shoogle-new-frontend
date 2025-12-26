import React from "react";
import { Globe, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactCTAButtonProps {
  type: "website" | "call" | "whatsapp";
  href: string;
  label?: string;
  className?: string;
}

const icons = {
  website: Globe,
  call: Phone,
  whatsapp: MessageCircle,
};

const defaultLabels = {
  website: "Website",
  call: "Call",
  whatsapp: "WhatsApp Seller",
};

const colorClasses = {
  website: "text-blue-700 border border-blue-700 bg-white hover:bg-blue-50",
  call: "text-green-700 border border-green-700 bg-white hover:bg-green-50",
  whatsapp: "text-green-700 border border-green-700 bg-white hover:bg-green-50",
};

// Make sure buttons look similar for all types.
const ContactCTAButton: React.FC<ContactCTAButtonProps> = ({
  type,
  href,
  label,
  className = "",
}) => {
  if (!href) return null;
  const Icon = icons[type];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("flex w-full justify-center", className)}
      tabIndex={0}
    >
      <button
        type="button"
        className={cn(
          "flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-base font-medium shadow-sm transition-all duration-200 sm:min-w-[132px]",
          colorClasses[type],
          className,
        )}
        aria-label={label || defaultLabels[type]}
      >
        <Icon className="h-5 w-5" />
        <span>{label || defaultLabels[type]}</span>
      </button>
    </a>
  );
};

export default ContactCTAButton;
