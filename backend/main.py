from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rapidfuzz import process, fuzz, utils
from typing import Dict, Literal, TypedDict
import subprocess


load_dotenv()

LanguagePol = Literal["polski", "angielski"]
LanguageEng = Literal["Polish", "English"]

english_to_polish_mapping: dict[LanguageEng, LanguagePol] = {
    "English": "angielski",
    "Polish": "polski"
}

lang_to_filename: Dict[LanguagePol, str] = {
    "angielski": "./data/train.en.txt",
    "polski" : "./data/train.pl.txt"
}

CONTEXT = "Jesteś pomocnym bilingwalnym tłumaczem specjalizującym się w tłumaczeniach pomiędzy językiem polskim, a angielskim. Jako wynik zwracasz samo tłumaczenie."


MODEL = "gpt-4o"
client = OpenAI()
app = FastAPI()

origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


def make_openai_api_call(prompt: str):
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            { "role": "system", "content": CONTEXT },
            { "role": "user", "content": prompt }
        ]
    )
    return response.choices[0].message.content


class TranslationExample(TypedDict):
    text: str
    line: str
    confidence: float
    translation: str


def find_n_fuzzy_matches(
        text: str, 
        source_filename: str, 
        n: int
    ) -> list[tuple[str,float, int]]:
    with open(source_filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        matches = process.extract(
            query=text, 
            choices=lines, 
            scorer=fuzz.ratio, 
            limit=n, 
            processor=utils.default_process
        )
        
        return matches


def read_line_n(filename: str, n: int):
    content = subprocess.run(
        args=['sed', '-n', f'{n}p', filename], 
        capture_output=True, 
        text=True
    )
    return content.stdout


def bind_fuzzy_matches_with_translations(
    fuzzy_matches: list[tuple[str,float, int]], 
    target_filename: str
    ) -> list[TranslationExample]:
    result = []
    for text, score, line in fuzzy_matches:
        result.append(TranslationExample({
            "text": text.strip(),
            "score": round(score, 2),
            "translation": read_line_n(
                filename=target_filename, 
                n=line + 1
            ).strip()
        }))
    return result


def translate_batch(text: str, source_language: LanguagePol, target_language: LanguagePol, n_shots: list[int]):
    source_filename = lang_to_filename[source_language]
    target_filename = lang_to_filename[target_language]
    translations = []

    if max(n_shots) > 1:
        matches = find_n_fuzzy_matches(
            text=text, 
            source_filename=source_filename,
            n=max(n_shots)
        )
        translation_examples = bind_fuzzy_matches_with_translations(
            fuzzy_matches=matches,
            target_filename=target_filename
        )

    def create_shot(example: TranslationExample):
        return f"{source_language}: {example['text']}\n" + \
               f"{target_language}: {example['translation']}"
        
    for n in n_shots:
        if n == 0:
            few_shots = None
            prompt = f"Przetłumacz z języka {source_language}ego na język {target_language}.\n" + \
                    f"{source_language}: {text}\n" + \
                    f"{target_language}:"
        else:
            few_shots = translation_examples[:n]
            prompt = f"Przetłumacz zdania z języka {source_language}ego" + \
                    f"na język {target_language}, biorąc pod uwagę " + \
                    f"przykłady tłumaczeń zdań podobnych.\n" + \
                    "\n".join([create_shot(s) for s in few_shots]) + \
                    f"\n{source_language}: {text}" + \
                    f"\n{target_language}: "
            
        translation = make_openai_api_call(prompt)
        translations.append({"translation": translation, "few_shots": few_shots})
    return translations


@app.get("/")
async def translate(source_language: LanguageEng, target_language: LanguageEng, text: str, shots: int):
    source_language = english_to_polish_mapping[source_language]
    target_language = english_to_polish_mapping[target_language]
    
    result = translate_batch(text, source_language, target_language, [0, shots])

    return result
