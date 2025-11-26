import React from 'react';
import { AnalysisResult } from '../types';

interface ResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            {result.title}
          </h2>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">核心摘要</h3>
            <p className="text-slate-700 leading-relaxed text-lg">
              {result.summary}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">详细笔记</h3>
            <div className="space-y-4">
              {result.points.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-mono font-bold">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-snug">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-white text-slate-600 font-medium rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
        >
          Analyzing Another Video
        </button>
      </div>
    </div>
  );
};
