"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const languageEnum = z.enum(["Polish", "English"]);

const formSchema = z
  .object({
    text: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    sourceLanguage: languageEnum,
    targetLanguage: languageEnum,
    shots: z
      .string()
      .pipe(
        z.coerce
          .number()
          .positive()
          .max(20, { message: "Maximum number of shots is 20." }),
      ),
  })
  .superRefine((val, ctx) => {
    if (val.sourceLanguage === val.targetLanguage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Target language must be different from source language.",
        fatal: true,
        path: ["targetLanguage"],
      });
    }

    return z.NEVER;
  });

export function TranslationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <h2 className="text-xl">Translation requirements</h2>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4">
            <div className="flex flex-1 gap-x-4">
              <FormField
                control={form.control}
                name="sourceLanguage"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Source language</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageEnum.options.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Target language</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageEnum.options.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shots"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Shots</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter number"
                        type="number"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="col-span-9 row-span-3">
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter text" rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Translate!</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
