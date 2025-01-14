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
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  code: z
    .string()
    .min(3, {
      message: "Code is too short",
    })
    .max(3, {
      message: "Code is too long",
    }),
});

export function OpenShareForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  const router = useRouter();
  async function onSubmit(input: z.infer<typeof FormSchema>) {
    router.push(`/share/${input.code.toUpperCase()}`);
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
                    minLength={3}
                    maxLength={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="flex w-full items-center gap-2">
            <ArrowRightIcon className="h-4 w-4" />
            Open share
          </Button>
        </form>
      </Form>
    </>
  );
}
