"use client";

import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Share } from "@/server/db/schema";

export function CopyShareLinkButton({ share }: { share: Share }) {
  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(share.content!);
        toast({
          title: "Copied to clipboard",
          description: "Share link copied to clipboard",
        });
      }}
    >
      <CopyIcon className="h-4 w-4" />
    </Button>
  );
}
