# LegalEase AI - Document Simplifier

A full-stack application that simplifies complex legal documents (PDFs) into easy-to-understand explanations using AI.

## Features
- **PDF Upload**: Drag & Drop interface to upload loan agreements.
- **AI Analysis**: Extracts key clauses and provides:
    - Simple English Explanation
    - Practical Examples
    - Regional Language Support (Hindi/Gujarati)
- **Responsive Design**: Modern, clean UI built with React & Tailwind CSS.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Axios, Lucide React.
- **Backend**: FastAPI, PDFPlumber, OpenAI API (or Mock Data).

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Backend Setup
Navigate to the extracted folder:
```bash
cd src/backend
```

Create and activate a virtual environment (optional but recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Set up Environment Variables:
Create a `.env` file in `src/backend` (optional, defaults to Mock Data if missing):
```env
OPENAI_API_KEY=your_api_key_here
```

Run the Server:
```bash
# Make sure you are in the project root or set PYTHONPATH
export PYTHONPATH=$json_pwd/src/backend
uvicorn src.backend.main:app --host 0.0.0.0 --port 8000 --reload
```
*The backend runs on http://localhost:8000*

### 2. Frontend Setup
Navigate to the frontend folder:
```bash
cd src/frontend
```

Install dependencies:
```bash
npm install
```

Run the Development Server:
```bash
npm run dev
```
*The frontend runs on http://localhost:5173*

## Usage
1. Open the frontend URL.
2. Upload a Loan Agreement PDF (e.g., `test_loan.pdf`).
3. Wait for the analysis cards to appear.

## Project Structure
```
.
├── input-pdfs/          # Stores uploaded PDFs
├── screenshots/         # Artifacts
├── src/
│   ├── backend/         # FastAPI Application
│   └── frontend/        # React Application
├── generate_pdf.py      # Script to generate test PDF
└── README.md
```
