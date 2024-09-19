import { useState } from "react";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { TranslationForm } from "./components/translation-form";
import { TranslationResult } from "./components/translation-result";

export const App = () => {
  const [results, setResults] = useState<TranslationResult[] | null>(null);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container mx-auto flex flex-col gap-y-6 px-8 py-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Master’s Thesis Project</h1>
            <ModeToggle />
          </div>
          <p>by Piotr Dąbrowski</p>
        </div>
        <TranslationForm setResults={setResults} />
        {results &&
          results.map((result, index) => (
            <TranslationResult key={index} result={result} />
          ))}
      </div>
    </ThemeProvider>
  );
};
