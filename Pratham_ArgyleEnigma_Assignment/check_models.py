import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv("src/backend/.env")

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try looking for OPENAI_API_KEY if it was set there
    api_key = os.getenv("OPENAI_API_KEY")

print(f"Key found: {api_key[:10]}...")
genai.configure(api_key=api_key)

try:
    print("Listing models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error: {e}")
