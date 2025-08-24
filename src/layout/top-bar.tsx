import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface TopBarProps {
  readonly setSidebarOpen: (value: boolean) => void;
}

export function TopBar({ setSidebarOpen }: TopBarProps) {
  return (
    <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1" />
    </div>
  );
}
