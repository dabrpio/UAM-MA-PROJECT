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
import { EXAMPLES } from "@/lib/contants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TranslationResult } from "./translation-result";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Textarea } from "./ui/textarea";

const languageEnum = z.enum(["Polish", "English"]);

const formSchema = z
  .object({
    text: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    source_language: languageEnum,
    target_language: languageEnum,
    shots: z.string().pipe(
      z.coerce
        .number()
        .positive()
        .max(20, { message: "Maximum number of shots is 20." })
        .transform((arg) => arg.toString()),
    ),
  })
  .superRefine((val, ctx) => {
    if (val.source_language === val.target_language) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Target language must be different from source language.",
        fatal: true,
        path: ["target_language"],
      });
    }

    return z.NEVER;
  });

export type TranslationRequirements = z.infer<typeof formSchema>;

interface TranslatioFormProps {
  setResults: React.Dispatch<React.SetStateAction<TranslationResult[] | null>>;
}

export function TranslationForm({ setResults }: TranslatioFormProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      source_language: undefined,
      target_language: undefined,
      shots: "",
    },
  });
  //   const {setValue} = form

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams(values).toString();
    fetch(`${import.meta.env.VITE_BACKEND_URL}?${params}`)
      .then((res) => res.json())
      .then((data: TranslationResult[]) => {
        setResults(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Translation requirements</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4">
            <div className="flex flex-1 gap-x-4">
              <FormField
                control={form.control}
                name="source_language"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Source language</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
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
                name="target_language"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Target language</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
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
                        // defaultValue={field.value}'
                        {...field}
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
          <CardFooter className="flex justify-between">
            <div className="flex gap-x-2">
              <Button type="submit">Translate!</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSheetOpen(true)}
              >
                Load example
              </Button>
            </div>
            <div className="flex gap-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset form
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setResults(null)}
              >
                Reset results
              </Button>
            </div>
          </CardFooter>
        </Card>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="overflow-x-auto">
            <SheetHeader>
              <SheetTitle>Select example</SheetTitle>
              {EXAMPLES.map((e) => (
                <Button
                  key={e.text}
                  variant="outline"
                  onClick={() => {
                    form.setValue("text", e.text);
                    form.setValue("source_language", e.source_language);
                    form.setValue("target_language", e.target_language);
                    form.setValue("shots", e.shots);
                    setIsSheetOpen(false);
                  }}
                  className="h-auto overflow-hidden text-ellipsis text-wrap p-2"
                >
                  {e.text}
                </Button>
              ))}
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </form>
    </Form>
  );
}
