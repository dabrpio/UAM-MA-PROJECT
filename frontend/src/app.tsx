import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { TranslationForm } from "./components/translation-form";

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col container mx-auto py-6 px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Master’s Thesis Project</h1>
          <ModeToggle />
        </div>
        <p>by Piotr Dąbrowski</p>
        <div className="mt-6">
          <TranslationForm />
        </div>
      </div>
    </ThemeProvider>
  );
};
