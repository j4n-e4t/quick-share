"use client";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

export default function OpenShareForm() {
  const router = useRouter();
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const code = formData.get("code") as string;
        if (code.length !== 4) {
          return;
        }
        router.push(`/s/${code}`);
      }}
    >
      <Input
        name="code"
        type="text"
        required
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck="false"
        className="uppercase"
        placeholder="ABCD"
        minLength={4}
        maxLength={4}
      />

      <Button type="submit" className="flex w-full items-center gap-2">
        <ArrowRightIcon className="h-4 w-4" />
        Open share
      </Button>
    </form>
  );
}
