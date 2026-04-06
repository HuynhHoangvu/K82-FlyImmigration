import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Tailwind max-width class, mặc định max-w-2xl */
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export default function Modal({ title, onClose, children, size = "xl" }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-theme-surface border border-theme-border-default rounded-2xl shadow-2xl w-full ${SIZE_MAP[size]} max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-theme-border-default sticky top-0 bg-theme-surface z-10">
          <h2 className="font-semibold text-theme-text-base">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-theme-text-tertiary hover:text-theme-text-base hover:bg-theme-surfaceSecondary transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
