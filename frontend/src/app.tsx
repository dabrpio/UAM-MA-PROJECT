import { useState } from "react";

enum Language {
  POL = "Polish",
  ENG = "English",
}

export const App = () => {
  const [sourceLanguage, setSourceLanguage] = useState(Language.POL);
  const [targetLanguage, setTargetLanguage] = useState(Language.ENG);
  const [sourceValue, setSourceValue] = useState("");
  const [targetValue, setTargetValue] = useState("");

  const handleTranslateButtonClick = async () => {
    if (sourceValue.trim().length > 0) {
      const params = new URLSearchParams({
        sourceLanguage,
        targetLanguage,
        text: sourceValue,
      }).toString();

      await fetch(`${import.meta.env.VITE_BACKEND_URL}?${params}`)
        .then((res) => res.json())
        .then((data) => {
          setTargetValue(data as string);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const toggleLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-4">
      <button onClick={toggleLanguages} className="rounded border px-3 py-2">
        {sourceLanguage} to {targetLanguage}
      </button>
      <textarea
        value={sourceValue}
        onChange={(e) => {
          setSourceValue(e.target.value);
        }}
        className="w-full rounded border border-gray-500 px-3 py-2"
      />
      <button
        onClick={handleTranslateButtonClick}
        className="w-min rounded bg-blue-400 px-3 py-2 text-white"
      >
        Translate
      </button>
      <textarea
        value={targetValue}
        onChange={(e) => {
          setTargetValue(e.target.value);
        }}
        className="w-full rounded border border-gray-500 px-3 py-2"
      />
    </div>
  );
};
