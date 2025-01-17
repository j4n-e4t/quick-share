import { Github } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between bg-background p-4">
      <Link href="/">
        <span className="text-2xl font-bold">
          Quick
          <span className="text-primary">Share</span>
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <Link target="_blank" href="https://github.com/j4n-e4t/quick-share">
          <Button variant="outline" size="icon">
            <Github className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
