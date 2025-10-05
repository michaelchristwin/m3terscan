import { Moon, Sun } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useFetcher } from "react-router";

export function ModeToggle() {
  const fetcher = useFetcher();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() =>
            fetcher.submit(
              { "color-scheme": "light" },
              { method: "post", action: "/action/set-theme" }
            )
          }
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            fetcher.submit(
              { "color-scheme": "dark" },
              { method: "post", action: "/action/set-theme" }
            )
          }
        >
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
