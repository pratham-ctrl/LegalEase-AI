import { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ResultsDisplay from './components/ResultsDisplay';
import { uploadPDF } from './api';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (file) => {
    if (!file) {
      setResults(null);
      setIsMock(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setIsMock(false);

    try {
      const data = await uploadPDF(file);
      setResults(data.results);
      setIsMock(data.is_mock);
    } catch (err) {
      console.error(err);
      setError("Failed to process the document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Understand Your Loan<br />
              <span className="text-brand-600">Before You Sign</span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-500">
              Upload your loan agreement PDF and let our AI highlight and simplify the most critical clauses for you.
            </p>
          </div>

          <FileUpload onFileSelect={handleFileSelect} isLoading={loading} />

          {error && (
            <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
              {error}
            </div>
          )}

          <ResultsDisplay results={results} isMock={isMock} />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} LegalEase AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
