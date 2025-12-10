from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from pathlib import Path
from pdf_processor import extract_content_from_pdf
from ai_service import ai_service

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("input-pdfs")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.get("/api/health")
def read_root():
    return {"status": "ok", "message": "Backend is running"}

@app.post("/api/process")
async def process_pdf(file: UploadFile = File(...)):
    try:
        file_location = UPLOAD_DIR / file.filename
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 1. Extract Content (Text or Image)
        content_data = extract_content_from_pdf(str(file_location))
        
        # 2. AI Analysis
        analysis_response = ai_service.analyze_document(content_data)
        
        return {
            "filename": file.filename,
            "results": analysis_response["clauses"],
            "is_mock": analysis_response["is_mock"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
