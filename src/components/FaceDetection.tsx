import React, { useState, useRef, useEffect } from 'react';
import { ScanFace, Upload, Image as ImageIcon, Search, ShieldAlert, Cpu, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

export function FaceDetection() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Authenticate anonymously so we can write to Firestore
    signInAnonymously(auth).catch(err => console.error("Auth error", err));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Img = event.target?.result as string;
        setImageSrc(base64Img);
        setIsScanning(true);
        setScanComplete(false);
        setError('');
        
        try {
          // Call Backend API for Face Detection (Gemini Vision)
          const response = await fetch('/api/face/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Img })
          });
          
          const result = await response.json();
          if (result.error) {
            throw new Error(result.error);
          }
          
          setAnalysisResult(result);
          
          // Store resulting hash in Firestore
          if (auth.currentUser) {
            await addDoc(collection(db, 'faceAnalyses'), {
              userId: auth.currentUser.uid,
              hash: result.hash,
              createdAt: serverTimestamp(),
            });
          }
          
        } catch (err: any) {
          setError(err.message || "Failed to analyze face");
        } finally {
          setIsScanning(false);
          setScanComplete(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelImage = () => {
    setImageSrc(null);
    setIsScanning(false);
    setScanComplete(false);
    setAnalysisResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter uppercase text-zinc-100 flex items-center gap-3">
          <ScanFace className="w-8 h-8 text-indigo-500" />
          Face Analysis & OSINT
        </h1>
        <p className="text-zinc-500 mt-2 text-sm uppercase tracking-wide">Facial recognition pivoting and reverse image search operations.</p>
      </header>

      {error && (
        <div className="p-4 border border-red-500/20 bg-red-500/5 rounded text-sm text-red-500 text-center">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-lg p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[320px]">
            {!imageSrc ? (
              <>
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-indigo-500" />
                </div>
                <p className="text-zinc-400 text-sm mb-6 text-center max-w-xs">Upload a target facial image to begin biometric analysis and pivot searching.</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/50 text-indigo-400 px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Select Image
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="relative w-full max-w-[240px] aspect-[3/4] border border-indigo-500/30 rounded overflow-hidden">
                  <img src={imageSrc} alt="Target" className="w-full h-full object-cover" />
                  
                  {isScanning && (
                    <div className="absolute inset-0 bg-indigo-500/20 z-10">
                      <div className="w-full h-1 bg-indigo-400 absolute top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                      <div className="absolute inset-0 border-2 border-dashed border-indigo-500/50 m-4 rounded scale-95 animate-pulse" />
                      
                      <div className="absolute bottom-4 left-0 w-full text-center">
                        <span className="bg-indigo-900/80 text-indigo-200 text-[10px] px-2 py-1 rounded uppercase tracking-widest font-mono">
                          Extracting Vectors...
                        </span>
                      </div>
                    </div>
                  )}

                  {scanComplete && !error && (
                    <div className="absolute inset-0 ring-2 ring-inset ring-emerald-500 z-10 pointer-events-none">
                      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-500" />
                      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-500" />
                      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-500" />
                      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-500" />
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex gap-4">
                  <button 
                    onClick={cancelImage}
                    className="text-zinc-500 hover:text-zinc-300 text-xs uppercase tracking-widest font-semibold"
                  >
                    Clear Target
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded p-6 min-h-[320px]">
            <h3 className="text-zinc-100 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-[#1a1a1a] pb-3">
              <Cpu className="w-4 h-4 text-indigo-500" />
              Analysis Results
            </h3>

            {!imageSrc ? (
              <div className="h-[200px] flex items-center justify-center text-zinc-600 text-sm italic font-mono">
                Awaiting target image...
              </div>
            ) : isScanning ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-indigo-400">
                  <span className="animate-pulse">▶</span> Processing image data via GenAI...
                </div>
                <div className="flex items-center gap-2 text-indigo-400/80 delay-75">
                  <span className="animate-pulse">▶</span> Mapping facial landmarks...
                </div>
                <div className="flex items-center gap-2 text-indigo-400/60 delay-150">
                  <span className="animate-pulse">▶</span> Generating biometric hash & writing to DB...
                </div>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Metadata Signatures</div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="bg-[#111] p-2 rounded text-zinc-400 border border-[#222]">
                      <span className="block text-[9px] text-zinc-600 mb-1">GENDER / AGE</span>
                      {analysisResult.gender || 'Unknown'} / {analysisResult.age || 'Unknown'}
                    </div>
                    <div className="bg-[#111] p-2 rounded text-zinc-400 border border-[#222]">
                      <span className="block text-[9px] text-zinc-600 mb-1">MOOD EXPRESSION</span>
                      {analysisResult.mood || 'Neutral'}
                    </div>
                    <div className="bg-[#111] p-2 rounded text-zinc-400 border border-[#222]">
                      <span className="block text-[9px] text-zinc-600 mb-1">BIOMETRIC QUALITY</span>
                      {analysisResult.quality || 'High (95%)'}
                    </div>
                    <div className="bg-[#111] p-2 rounded text-zinc-400 border border-[#222] col-span-2">
                      <span className="block text-[9px] text-zinc-600 mb-1">UNIQUE FACE HASH</span>
                      <span className="text-emerald-500">{analysisResult.hash}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Pivot Search Engines</div>
                  <div className="space-y-2">
                    <a href="https://pimeyes.com" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 rounded group transition-all">
                      <span className="text-indigo-400 text-sm font-semibold group-hover:text-indigo-300">PimEyes (Facial Recognition)</span>
                      <ExternalLink className="w-4 h-4 text-indigo-500/50 group-hover:text-indigo-400" />
                    </a>
                    <a href="https://facecheck.id" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 rounded group transition-all">
                      <span className="text-indigo-400 text-sm font-semibold group-hover:text-indigo-300">FaceCheck.id</span>
                      <ExternalLink className="w-4 h-4 text-indigo-500/50 group-hover:text-indigo-400" />
                    </a>
                    <a href="https://tineye.com" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 rounded group transition-all">
                      <span className="text-indigo-400 text-sm font-semibold group-hover:text-indigo-300">TinEye (Reverse Image)</span>
                      <ExternalLink className="w-4 h-4 text-indigo-500/50 group-hover:text-indigo-400" />
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}} />
    </div>
  );
}
