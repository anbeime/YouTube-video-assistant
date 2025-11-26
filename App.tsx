import React, { useState, useEffect } from 'react';
import { UploadZone } from './components/UploadZone';
import { ResultView } from './components/ResultView';
import { analyzeMedia } from './services/geminiService';
import { fileToBase64 } from './services/fileUtils';
import { AppState, AnalysisResult } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // URL input state (for UX purposes, though processing relies on upload)
  const [urlInput, setUrlInput] = useState('');

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setErrorMsg(null);
    processFile(file);
  };

  const processFile = async (file: File) => {
    setAppState(AppState.PROCESSING);
    try {
      // Check file size limit (client-side safety for Base64)
      const MAX_SIZE_MB = 200; 
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Please upload files under ${MAX_SIZE_MB}MB for this demo.`);
      }

      const base64Data = await fileToBase64(file);
      const analysis = await analyzeMedia(base64Data, file.type);
      setResult(analysis);
      setAppState(AppState.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during analysis.");
      setAppState(AppState.ERROR);
    }
  };

  const handleUrlSubmit = () => {
     // Since client-side JS cannot download YouTube videos directly due to CORS and API limits without a proxy,
     // we provide a helpful message guiding the user to the robust file upload flow.
     if (!urlInput.trim()) return;
     
     setErrorMsg("Browser limits prevent direct YouTube downloading. Please download the video or audio track (e.g. using a tool) and upload the file here for AI analysis.");
     setAppState(AppState.ERROR);
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setSelectedFile(null);
    setResult(null);
    setErrorMsg(null);
    setUrlInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">VidSumm <span className="text-blue-600">AI</span></h1>
          </div>
          <div className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-500">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        
        {/* Intro Section - Only show when IDLE or ERROR */}
        {(appState === AppState.IDLE || appState === AppState.ERROR) && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Your Personal Video Learning Assistant
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upload a lecture, meeting recording, or tutorial. We'll analyze it and provide a structured summary with timestamps in Chinese.
            </p>
          </div>
        )}

        {/* Action Area */}
        <div className="max-w-xl mx-auto">
          
          {appState === AppState.ERROR && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start gap-3 border border-red-100">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mt-0.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <div className="text-sm">{errorMsg}</div>
            </div>
          )}

          {appState === AppState.IDLE || appState === AppState.ERROR ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-8">
              
              {/* Option 1: File Upload */}
              <div>
                <UploadZone 
                  onFileSelect={handleFileSelect} 
                  isLoading={appState === AppState.PROCESSING} 
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500">OR</span>
                </div>
              </div>

              {/* Option 2: YouTube URL Input (Visual mostly, with explanation) */}
              <div className="space-y-3">
                <label htmlFor="url" className="block text-sm font-medium text-slate-700">
                  Paste YouTube Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="url"
                    placeholder="https://youtube.com/watch?v=..."
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <button 
                    onClick={handleUrlSubmit}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Go
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  *Direct YouTube links require external tools to download first. Please upload the .mp4 or .mp3 file above for best results.
                </p>
              </div>

            </div>
          ) : null}
        </div>

        {/* Loading State */}
        {appState === AppState.PROCESSING && (
           <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
             <div className="relative w-20 h-20">
               <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
               <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
             </div>
             <h3 className="mt-8 text-xl font-semibold text-slate-800">Analyzing Content...</h3>
             <p className="text-slate-500 mt-2">This may take a minute depending on file size.</p>
           </div>
        )}

        {/* Results View */}
        {appState === AppState.COMPLETED && result && (
          <ResultView result={result} onReset={resetApp} />
        )}

      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} VidSumm AI. Experimental Demo.
      </footer>
    </div>
  );
};

export default App;
