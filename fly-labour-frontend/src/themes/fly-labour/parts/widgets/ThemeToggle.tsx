import { useThemeStore } from "@/core/store/themeStore";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggle } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Tránh hydration mismatch

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-lg
        bg-theme-surface hover:bg-theme-surfaceSecondary
        border border-theme-border-default
        transition-all duration-300
        text-theme-text-base hover:text-brand-gold-primary
      "
    >
      {theme === "light" ? (
        <Moon size={20} className="text-brand-gold" />
      ) : (
        <Sun size={20} className="text-brand-gold" />
      )}
    </button>
  );
};
