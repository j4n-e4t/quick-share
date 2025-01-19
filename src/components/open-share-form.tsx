"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";

const FormSchema = z.object({
  code: z
    .string()
    .min(4, {
      message: "Code is too short",
    })
    .max(4, {
      message: "Code is too long",
    }),
});

export function OpenShareForm() {
  const { mutate, isPending } = api.share.getId.useMutation();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  const router = useRouter();
  async function onSubmit(input: z.infer<typeof FormSchema>) {
    mutate(
      { code: input.code },
      {
        onSuccess: (result) => {
          if (!result?.shareId) throw new Error("Share not found");
          router.push(`/s/${result.shareId}`);
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

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="uppercase"
                    placeholder="ABC"
                    {...field}
                    minLength={4}
                    maxLength={4}
                  />
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
            <ArrowRightIcon className="h-4 w-4" />
            Open share
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          </Button>
        </form>
      </Form>
    </>
  );
}
