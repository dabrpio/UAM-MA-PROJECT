from dotenv import load_dotenv
from os import getenv
from openai import OpenAI
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


@app.get("/")
async def translate(text: str):
  completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
      {"role": "system", "content": "You are a translator, skilled in translation between Polish and English languages."},
      {"role": "user", "content": f"Translate the following text from English to Polish: {text}"}
    ]
  )
  return completion.choices[0].message.content
