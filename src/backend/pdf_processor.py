import pdfplumber
import pypdfium2 as pdfium
import base64
import pytesseract
import logging
from io import BytesIO

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_content_from_pdf(file_path: str) -> dict:
    """
    Extracts text or images from a PDF file.
    Returns a dict: {"type": "text" | "image", "content": str | list[str]}
    """
    try:
        # 1. Try Text Extraction
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        logger.info(f"Extracted {len(text)} characters from {file_path}")

        # 2. If text is sufficient, return text
        if len(text.strip()) > 100:
            return {"type": "text", "content": text}
        
        # 3. Fallback to Image Extraction (OCR)
        logger.info("Text extraction weak. Falling back to Local OCR (Tesseract).")
        
        pdf = pdfium.PdfDocument(file_path)
        extracted_text = ""
        
        # Limit to first 3 pages for speed
        n_pages = min(len(pdf), 3)
        
        for i in range(n_pages):
            page = pdf[i]
            bitmap = page.render(scale=2) # 2x scale for better quality
            pil_image = bitmap.to_pil()
            
            # Use Tesseract to get text
            page_text = pytesseract.image_to_string(pil_image)
            extracted_text += page_text + "\n"
            
        logger.info(f"OCR Extracted {len(extracted_text)} characters.")
        
        # Return as text type so the AI Service treats it as normal text
        return {"type": "text", "content": extracted_text}

    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        raise e
