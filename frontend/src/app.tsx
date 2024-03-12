import { useState } from "react";

export const App = () => {
  const [sourceValue, setSourceValue] = useState("");
  const [resultValue, setResultValue] = useState("");

  const handleTranslateButtonClick = async () => {
    if (sourceValue.trim().length > 0) {
      const params = new URLSearchParams({ text: sourceValue }).toString();
      await fetch(`${import.meta.env.VITE_BACKEND_URL}?${params}`)
        .then((res) => res.json())
        .then((data) => {
          setResultValue(data as string);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-4">
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
        value={resultValue}
        onChange={(e) => {
          setResultValue(e.target.value);
        }}
        className="w-full rounded border border-gray-500 px-3 py-2"
      />
    </div>
  );
};
