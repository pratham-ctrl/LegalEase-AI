import React from 'react';
import { FileText } from 'lucide-react';

const Header = () => {
    return (
        <header className="w-full bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-brand-500 p-2 rounded-lg">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">LegalEase AI</h1>
                        <p className="text-xs text-gray-500 font-medium">Document Simplifier</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    {/* Placeholder for future nav items or user profile */}
                    <div className="text-sm text-gray-500">v1.0.0</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
