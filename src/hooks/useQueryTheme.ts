import { useEffect } from "react";
import { themes } from "~/constants/themes";

export function useQueryTheme() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const themeName = params.get("theme");

    if (!themeName) return;

    const theme = themes[themeName.toLowerCase()];
    if (!theme) return;

    // Apply all variables for that theme
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, []);
}
