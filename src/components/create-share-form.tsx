"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CopyIcon, Loader2, SendIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { api } from "@/trpc/react";

import { useState } from "react";
import type { Share } from "@/server/db/schema";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const FormSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(2, {
    message: "Content is too short",
  }),
  availableUntil: z.string().min(1, {
    message: "Please select a duration",
  }),
});

export function CreateShareForm() {
  const { mutate, isPending } = api.share.create.useMutation();
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      availableUntil: "1h",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(
      {
        title: data.title ?? "",
        content: data.content,
        availableUntil: data.availableUntil,
      },
      {
        onSuccess: (code) => {
          setShareCode(code);
          setIsOpen(true);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  }

  const handleDialogClose = () => {
    setIsOpen(false);
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="My share" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write something..."
                    className="h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableUntil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available for</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="flex w-full items-center gap-2"
            disabled={isPending}
          >
            <SendIcon className="h-4 w-4" />
            Share
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          </Button>
        </form>
      </Form>

      <AlertDialog open={isOpen} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🎉 Share created!</AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col gap-2">
              <span>Your share code is:</span>

              <span className="flex flex-row gap-2">
                {shareCode?.split("").map((char, index) => (
                  <span
                    key={index}
                    className="flex h-10 w-10 items-center justify-center rounded bg-primary px-2 py-1 font-mono text-lg text-primary-foreground"
                  >
                    {char}
                  </span>
                ))}
              </span>
              <span>
                Just tell your friends the code and they can view your share.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/s/${shareCode}`,
                );
                toast({
                  title: "Copied to clipboard",
                  description: "Share link copied to clipboard",
                });
              }}
            >
              <CopyIcon className="h-4 w-4" />
              Copy share link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
