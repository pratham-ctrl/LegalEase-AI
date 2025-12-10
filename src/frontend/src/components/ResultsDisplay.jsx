import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, HelpCircle, Lightbulb, Languages, Check } from 'lucide-react';

const Card = ({ clause, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
            <div className="p-6 md:p-8 space-y-6">
                {/* Header / Title if needed, or just clean sections */}

                {/* Original Clause */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                        <BookOpen className="w-4 h-4 text-brand-600" />
                        Original Text
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed border-l-4 border-gray-300 font-serif italic">
                        "{clause.original_clause}"
                    </div>
                </div>

                {/* Simplified & Regional Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            Simplified
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {clause.simple_explanation}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                            <Languages className="w-4 h-4 text-indigo-500" />
                            Regional Explanation
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {clause.regional_language_explanation}
                        </p>
                    </div>
                </div>

                {/* Example Section */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="bg-green-50 rounded-xl p-4 flex gap-4 items-start">
                        <div className="bg-green-100 p-2 rounded-lg shrink-0">
                            <Check className="w-4 h-4 text-green-700" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-900 text-sm mb-1">Example Scenario</h4>
                            <p className="text-green-800 text-sm leading-relaxed">
                                {clause.example}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ResultsDisplay = ({ results, isMock }) => {
    if (!results || results.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12 space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                <p className="text-gray-500">Here are the key clauses from your document, simplified.</p>
            </div>

            {isMock && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Lightbulb className="h-5 w-5 text-amber-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-amber-700">
                                <strong>Running in Demo Mode:</strong> No valid OpenAI API Key detected. These results are simulated mock data to demonstrate the UI structure.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {results.map((clause, index) => (
                    <Card key={index} clause={clause} index={index} />
                ))}
            </div>
        </div>
    );
};

export default ResultsDisplay;
