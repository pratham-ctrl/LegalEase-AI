import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)
import google.generativeai as genai
from PIL import Image
from io import BytesIO
import base64
import logging
import json
from openai import OpenAI
from mock_data import MOCK_CLAUSES

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY") or os.getenv("GEMINI_API_KEY") # Backward compatibility
        self.provider = None
        self.client = None
        
        if self.api_key:
            if self.api_key.startswith("sk-"):
                self.provider = "openai"
                self.client = OpenAI(api_key=self.api_key)
                logger.info("AIService initialized with OpenAI API Key.")
            elif self.api_key.startswith("AIza"):
                self.provider = "gemini"
                genai.configure(api_key=self.api_key)
                self.client = genai.GenerativeModel('gemini-flash-latest')
                logger.info("AIService initialized with Google Gemini API Key (Model: gemini-flash-latest).")
        else:
            logger.warning("AIService initialized WITHOUT API Key. Using mock data.")

    def analyze_document(self, input_data: dict) -> dict:
        """
        Analyzes document content (text or image) and returns simplified clauses.
        Returns: {"clauses": list, "is_mock": bool}
        """
        # --- Smart Mock: If no Client, use real text but fake analysis ---
        if not self.client:
            logger.info("No API Key found. Generating Smart Mock data from input text.")
            # ... [Existing Smart Mock Logic] ...
            real_text = ""
            if input_data["type"] == "text":
                real_text = input_data["content"]
            elif input_data["type"] == "image":
                real_text = "This document appears to be a scanned image. Local OCR might have missed it."

            import random
            fragments = [f.strip() for f in real_text.split('.') if len(f.strip()) > 50]
            if not fragments:
                 fragments = [
                     "The Borrower hereby agrees to the terms and conditions set forth.",
                     "Interest shall be calculated on a floating rate basis.",
                     "In the event of default, the Bank reserves the right to recall the loan."
                 ]
            selected_fragments = random.sample(fragments, min(3, len(fragments)))
            smart_mock_clauses = []
            for i, fragment in enumerate(selected_fragments):
                smart_mock_clauses.append({
                    "original_clause": fragment + ".",
                    "simple_explanation": "This corresponds to section " + str(i+1) + " of your document. [Demo Mode: AI analysis unavailable]",
                    "example": "For example, if this clause applied, it would mean X happens when Y occurs. [Demo Mode]",
                    "regional_language_explanation": "આ દસ્તાવેજનો એક ભાગ છે. [Demo Mode]"
                })
            return {"clauses": smart_mock_clauses, "is_mock": True}

        # --- Real Analysis ---
        system_instruction = """
        You are a legal expert. Analyze the financial document provided.
        Identify the 5 most complex and important clauses that a layperson should understand.
        For each clause, provide:
        1. The original text.
        2. A simple English explanation.
        3. A practical example.
        4. A explanation in Hindi (or Gujarati if context implies).

        Return the output purely as a JSON list of objects with keys:
        "original_clause", "simple_explanation", "example", "regional_language_explanation".
        """

        try:
            # === OPENAI IMPLEMENTATION ===
            if self.provider == "openai":
                messages = [{"role": "system", "content": system_instruction + " Output only valid JSON."}]
                
                if input_data["type"] == "text":
                    messages.append({"role": "user", "content": f"Analyze: {input_data['content'][:15000]}"})
                elif input_data["type"] == "image":
                    logger.info("Processing document as Image (Vision) via OpenAI.")
                    user_content = [{"type": "text", "text": "Analyze these pages of the financial document."}]
                    for img_b64 in input_data["content"]:
                        user_content.append({
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{img_b64}", "detail": "high"}
                        })
                    messages.append({"role": "user", "content": user_content})

                response = self.client.chat.completions.create(
                    model="gpt-4o", 
                    messages=messages,
                    temperature=0.2,
                    max_tokens=4000,
                    response_format={ "type": "json_object" }
                )
                content = response.choices[0].message.content

            # === GEMINI IMPLEMENTATION ===
            elif self.provider == "gemini":
                logger.info("Processing with Google Gemini...")
                
                inputs = [system_instruction + " Output ONLY valid JSON array."]
                
                if input_data["type"] == "text":
                    inputs.append(f"Document Text: {input_data['content'][:30000]}") # Gemini has huge context
                elif input_data["type"] == "image":
                    logger.info("Processing document as Image (Vision) via Gemini.")
                    inputs.append("Analyze these document images:")
                    for img_b64 in input_data["content"]:
                        image_data = base64.b64decode(img_b64)
                        img = Image.open(BytesIO(image_data))
                        inputs.append(img)
                
                response = self.client.generate_content(inputs)
                content = response.text
            
            # === COMMON PARSING ===
            # Clean up markdown code blocks if present (Gemini loves markdown)
            if "```json" in content:
                content = content.replace("```json", "").replace("```", "")
            elif "```" in content: # Sometimes just ```
                 content = content.replace("```", "")

            parsed_content = json.loads(content)
            
            # Handle if AI returns { "clauses": [...] } vs [...]
            clauses = parsed_content if isinstance(parsed_content, list) else parsed_content.get("clauses", parsed_content)
            
            return {"clauses": clauses, "is_mock": False}

        except Exception as e:
            logger.error(f"Error calling AI Provider ({self.provider}): {e}")
            # Fallback to smart mock if AI fails
            return {"clauses": MOCK_CLAUSES, "is_mock": True}

ai_service = AIService()
