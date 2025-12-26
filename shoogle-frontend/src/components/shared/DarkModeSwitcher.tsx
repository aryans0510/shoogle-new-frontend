import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const DarkModeSwitcher: React.FC = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [providerMissing, setProviderMissing] = useState(false);

  // To prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  // Fallback for direct toggling of HTML class if next-themes provider is missing
  const handleSwitch = (checked: boolean) => {
    if (typeof setTheme !== "function" || theme === undefined) {
      // Fallback: toggle dark class on <html>
      setProviderMissing(true);
      if (checked) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      console.warn("next-themes ThemeProvider not found! Using fallback HTML toggling.");
    } else {
      setProviderMissing(false);
      setTheme(checked ? "dark" : "light");
      console.log(`[DarkModeSwitcher] setTheme called with:`, checked ? "dark" : "light");
    }
  };

  // Make sure switch reflects the current state in both scenarios
  const isDark =
    theme === "dark" ||
    (theme === "system" && systemTheme === "dark") ||
    (!theme &&
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark"));

  if (!mounted) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-muted bg-background p-2 shadow-sm transition-all hover:shadow-lg">
      <Sun className={"h-4 w-4 " + (isDark ? "opacity-40" : "text-yellow-400")} />
      <Switch checked={isDark} onCheckedChange={handleSwitch} aria-label="Toggle dark mode" />
      <Moon className={"h-4 w-4 " + (!isDark ? "opacity-40" : "text-blue-500")} />
      {providerMissing && (
        <span className="ml-3 text-xs text-red-600">ThemeProvider missing! Fallback mode.</span>
      )}
    </div>
  );
};

export default DarkModeSwitcher;
