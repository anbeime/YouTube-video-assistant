import React, { useRef, useState } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  const validateAndPass = (file: File) => {
    // Basic validation
    if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      onFileSelect(file);
    } else {
      alert("Please upload a valid Video or Audio file.");
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-300 ease-in-out cursor-pointer
      ${isLoading ? 'opacity-50 pointer-events-none' : ''}
      ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-white'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
    >
      <input 
        ref={inputRef}
        type="file" 
        className="hidden" 
        accept="video/*,audio/*"
        onChange={handleChange}
      />
      
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        上传视频或音频文件
      </h3>
      <p className="text-sm text-slate-500 text-center max-w-xs">
        Drag & Drop or Click to Upload<br/>
        <span className="text-xs text-slate-400 mt-1 block">(Supports MP4, MOV, MP3, WAV - Max 50MB recommended for demo)</span>
      </p>
    </div>
  );
};
