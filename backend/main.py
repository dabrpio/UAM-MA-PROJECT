from typing import List, Literal, Dict
from dotenv import load_dotenv
from os import getenv
from openai import OpenAI
from thefuzz import process
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
OPENAI_API_KEY=getenv('OPENAI_API_KEY')

client = OpenAI(api_key=OPENAI_API_KEY)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Language = Literal['Polish','English']

@app.get("/")
async def translate(source_language: Language, target_language: Language, text: str):
  dataset_filenames: Dict[Language, str] = {
    'English': 'data-en.txt',
    'Polish': 'data-pl.txt'
  }

  with open('data/' + dataset_filenames[source_language], 'r') as file:
    dataset_source_lang = file.readlines()

  with open('data/' + dataset_filenames[target_language], 'r') as file:
    dataset_target_lang = file.readlines()


  fuzzy_matches = process.extract(text, dataset_source_lang, limit=5)
  dictionary: List[Dict[str, str]]  = []
  for match in fuzzy_matches:
    index = dataset_source_lang.index(match[0])
    dictionary.append({
      'source': match[0],
      'target': dataset_target_lang[index]
    })
  key_value_strings = [f"{obj['source'].strip()} => {obj['target'].strip()}" for obj in dictionary]
  shots = '\n'.join(key_value_strings)
  prompt = f"""
Complete the translations of the following sentences from {source_language} to {target_language}:
{shots}
{text} =>
"""
  
  completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
      {"role": "system", "content": "You are a translator, skilled in translation between Polish and English languages."},
      {
        "role": "user", 
        "content": prompt
      }
    ]
  )
  return {
    'translation': completion.choices[0].message.content,
    'few_shots': dictionary
  }
