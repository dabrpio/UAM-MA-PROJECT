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
  const [fewShots, setFewShots] = useState<
    { source: string; target: string }[]
  >([]);

  const handleTranslateButtonClick = async () => {
    if (sourceValue.trim().length > 0) {
      const params = new URLSearchParams({
        source_language: sourceLanguage,
        target_language: targetLanguage,
        text: sourceValue,
      }).toString();

      await fetch(`${import.meta.env.VITE_BACKEND_URL}?${params}`)
        .then((res) => res.json())
        .then(
          (data: {
            translation: string;
            few_shots: { source: string; target: string }[];
          }) => {
            setTargetValue(data.translation);
            setFewShots(data.few_shots);
          },
        )
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
      <table>
        <thead>
          <th className="px-3 py-2">Sentence</th>
          <th className="px-3 py-2">Translation</th>
        </thead>
        <tbody>
          {fewShots.map((shots, index) => (
            <tr key={index}>
              <td className="px-3 py-2">{shots.source}</td>
              <td className="px-3 py-2">{shots.target}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
