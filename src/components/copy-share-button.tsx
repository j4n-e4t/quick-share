"use client";

import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Share } from "@/server/api/routers/share";

export function CopyShareContentButton({ share }: { share: Share | null }) {
  return (
    <Button
      disabled={!share}
      onClick={async () => {
        await navigator.clipboard.writeText(share?.content ?? "");
        toast({
          title: "Copied to clipboard",
          description: "Share content copied to clipboard",
        });
      }}
    >
      <CopyIcon className="h-4 w-4" />
    </Button>
  );
}
