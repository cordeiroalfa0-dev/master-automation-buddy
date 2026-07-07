import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Toggle claro/escuro. Persiste em localStorage; respeita prefers-color-scheme
 * na primeira visita. A classe .dark é aplicada em <html> pelo ThemeInit inline
 * (evita flash of unstyled content).
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className="inline-grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

/** Script inline para aplicar tema ANTES do primeiro paint (sem flash). */
export const themeInitScript = `
(function(){
  try{
    var s = localStorage.getItem('theme');
    var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(s === 'dark' || (!s && m)) document.documentElement.classList.add('dark');
  }catch(e){}
})();
`.trim();