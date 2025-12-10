import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ onFileSelect, isLoading }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const validateFile = (file) => {
        if (file && file.type === 'application/pdf') {
            return true;
        }
        alert("Please upload a valid PDF file.");
        return false;
    }

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
                onFileSelect(file);
            }
        }
    }, [onFileSelect]);

    const handleChange = useCallback((e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
                onFileSelect(file);
            }
        }
    }, [onFileSelect]);

    const clearFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        onFileSelect(null);
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 px-4">
            <AnimatePresence>
                {!selectedFile ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`relative group rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out
              ${dragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'}
              h-64 flex flex-col items-center justify-center cursor-pointer overflow-hidden`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-upload-input').click()}
                    >
                        <input
                            id="file-upload-input"
                            type="file"
                            className="hidden"
                            accept="application/pdf"
                            onChange={handleChange}
                        />

                        <div className="z-10 flex flex-col items-center text-center p-6 transition-transform duration-300 group-hover:scale-105">
                            <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${dragActive ? 'bg-brand-100' : 'bg-gray-100 group-hover:bg-brand-50'}`}>
                                <Upload className={`w-8 h-8 ${dragActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-brand-500'}`} />
                            </div>
                            <p className="text-lg font-semibold text-gray-700 mb-1">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-gray-500">
                                PDF documents only (max 10MB)
                            </p>
                        </div>

                        {/* Background pattern equivalent */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-green-50 p-3 rounded-xl">
                                <File className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{selectedFile.name}</p>
                                <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <div className="text-sm font-medium text-brand-600 animate-pulse">Analyzing...</div>
                                <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <button
                                onClick={clearFile}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileUpload;
