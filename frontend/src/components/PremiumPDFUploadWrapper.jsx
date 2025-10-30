import React, { useState, useRef } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

function resolveImageUrl(img) {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("public/") || img.startsWith("storage/")) {
    return `https://cnokwulavcjuwyzaxbjc.supabase.co/storage/v1/object/${img}`;
  }
  if (img.startsWith("uploads/") || img.startsWith("temp/")) {
    return `${API_BASE}/${img}`;
  }
  return null;
}

import { Upload, FileCheck, Sparkles, ArrowLeft, Zap, Star, X, AlertCircle, FileText, Edit, Plus, Eye, Trash2, MoreVertical } from 'lucide-react';

function LandingPageCard({ page, onView, onDelete }) {
  const imgs = [
    page?.property_images?.main,
    page?.property_images?.img1,
    page?.property_images?.img2,
    page?.property_images?.img3,
  ]
    .map(resolveImageUrl)
    .filter(Boolean);

  return (
    <div
      onClick={() => onView(page)}
      className="group relative bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/60 hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* Image Preview */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {imgs.length ? (
          imgs.length > 1 ? (
            <div className="grid grid-cols-2 gap-1 h-full">
              {imgs.slice(0, 4).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ))}
            </div>
          ) : (
            <img
              src={imgs[0]}
              alt={page.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-700/40 text-gray-400">
            <FileText className="w-10 h-10" />
            <span className="ml-2 text-sm">No Preview</span>
          </div>
        )}
        {/* Price tag */}
         {page.price && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-semibold text-sm sm:text-base border border-white/10 shadow-md">
           ${page.price.toLocaleString("en-IN")}
            </div>
            )}
        {/* Overlay Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
  onClick={(e) => {
    e.stopPropagation();
    if (page.public_url) {
      window.open(page.public_url, "_blank");
    } else {
      alert("No shareable link found for this page.");
    }
  }}
  className="p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
  title="Preview Landing Page"
>
  <Eye className="w-4 h-4" />
</button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(page.id);
            }}
            className="p-2 bg-black/60 rounded-full text-red-400 hover:text-red-300 hover:bg-black/80 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute top-3 left-3 flex gap-2">
          {page.source === "ai" && (
            <span className="px-2 py-0.5 text-[10px] bg-blue-500/40 text-blue-100 rounded-md">
              AI Generated
            </span>
          )}
          {page.manual && (
            <span className="px-2 py-0.5 text-[10px] bg-purple-500/40 text-purple-100 rounded-md">
              Manual
            </span>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">
          {page.title || "Untitled"}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
          {page.description || "No description provided."}
        </p>
        {/* Property details (quick info row) */}
        {page.details && (
          <div className="flex flex-wrap gap-2 text-xs text-gray-300 mb-3">
            {page.details.split("|").map((d, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-slate-700/60 rounded-md border border-slate-600/40"
              >
                {d.trim()}
              </span>
            ))}
          </div>
        )}
        {/* Stats footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-slate-700/50 pt-3">
          <span>{page.date || "—"}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {page.views || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
// Create Component
function CreateNewPageCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-dashed border-slate-600 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer flex items-center justify-center w-[260px] h-[360px] mx-auto"
    >
      <div className="flex flex-col items-center text-center space-y-3 p-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Plus className="w-10 h-10 text-blue-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white mb-1">
            Create New Page
          </h3>
          <p className="text-xs text-gray-400">
            Start building your landing page
          </p>
        </div>
      </div>
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    </div>
  );
}
// Dashboard
function DashboardGridView({ onCreateNew, savedPages, onView, onDelete }) {
  return (
<div className="fixed inset-0 md:left-[205px] bg-black text-white overflow-y-auto overflow-x-hidden no-scrollbar w-full md:w-[calc(100%-205px)]">
      <div className="border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CreateNewPageCard onClick={onCreateNew} />
          {savedPages.map((page) => (
            <LandingPageCard
              key={page.id}
              page={page}
              onView={onView}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function PremiumPDFUpload({ onUploadComplete }) {
  const [step, setStep] = useState('dashboard');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [savedPages, setSavedPages] = useState([]);
  //
  function resolveImageUrl(img) {
  if (!img || typeof img !== 'string') return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('uploads/') || img.startsWith('temp/')) {
    return `${API_BASE}/${img}`;
  }
  return null;
}
  React.useEffect(() => {
  async function fetchPages() {
    try {
      const res = await fetch(`${API_BASE}/api/landing-pages`);
      const data = await res.json();
      setSavedPages(
      data.map(p => {
      let imgs = p.property_images;
      if (typeof imgs === 'string') {
      try { imgs = JSON.parse(imgs); } catch { imgs = {}; }
    }
    const thumbnail = resolveImageUrl(p.thumbnail) || resolveImageUrl(imgs?.main);
    //date
    let formattedDate = '—';
    if (p.created_at) {
      const d = new Date(p.created_at);
      if (!isNaN(d)) formattedDate = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    const shareId = p.share_id;
    const publicUrl = p.public_url || (shareId ? `${API_BASE}/landing/${shareId}` : null);
    return {
      id: p.id,
      title: p.title || 'Untitled',
      description: p.description || '',
      price: p.price || '',

      property_images: imgs || {},
      thumbnail,
      date: formattedDate,
      views: Math.floor(Math.random() * 2000) + 100,
      creation_type: p.creation_type || p.source || null,
       };
     })
  );
    } catch (err) {
      console.error("Error fetching pages:", err);
    }
  }
  fetchPages();
}, []);


  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      setStep('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setStep('error');
      return;
    }

    setIsUploading(true);
    setProgress(10);
    setError(null);
    setStep('processing');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch(`${API_BASE}/api/landing-pages/extract-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const data = await response.json();
      setProgress(100);
      setUploadedFile(file);
      const extracted = data?.data || data || {};

      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          if (typeof onUploadComplete === 'function') {
            onUploadComplete({ data: extracted });
          }
        }, 2000);
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to process PDF. Please try again.');
      setStep('error');
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const resetUpload = () => {
    setStep('upload');
    setProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleViewPage = (page) => {
    console.log('View page:', page);
    // Implement view logic here
  };

  const handleDeletePage = (id) => {
    if (confirm('Are you sure you want to delete this landing page?')) {
      setSavedPages(savedPages.filter(p => p.id !== id));
    }
  };

  // Step 0: Dashboard Grid View
  if (step === 'dashboard') {
    return (
      <DashboardGridView
        onCreateNew={() => setStep('mode-selection')}
        savedPages={savedPages}
        onView={handleViewPage}
        onDelete={handleDeletePage}
      />
    );
  }

  // Step 1: Mode Selection Screen
  if (step === 'mode-selection') {
    return (
      <div className="fixed inset-0 md:left-[205px] bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 overflow-auto">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl w-full">
          {/* Back Button */}
          <button
            onClick={() => setStep('dashboard')}
            className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="flex justify-center mb-6">
              
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
              Create Your Landing Page
            </h1>

            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Choose how you'd like to build your property landing page
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Option 1: With PDF */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              
              <div
                onClick={() => setStep('choice')}
                className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 rounded-2xl p-10 cursor-pointer hover:border-blue-500/50 transition-all duration-300 h-full"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-10 h-10 text-white" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white">
                      Create with PDF
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                      Upload a property listing PDF and let AI automatically extract all details to create your landing page
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-400 w-full">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span>Automatic data extraction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span>AI-powered content generation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>Instant page creation</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                    Upload PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Option 2: Without PDF (Manual) */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              
              <div
                onClick={() => {
                  if (typeof onUploadComplete === 'function') {
                    onUploadComplete({ data: {}, manual: true });
                  }
                }}
                className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 rounded-2xl p-10 cursor-pointer hover:border-purple-500/50 transition-all duration-300 h-full"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Edit className="w-10 h-10 text-white" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white">
                      Create Manually
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                      Build your landing page from scratch with complete control over every detail and element
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-400 w-full">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4 text-purple-400" />
                      <span>Full customization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span>Complete creative control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Design from ground up</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                    Start Creating
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Choice Screen (PDF introduction)
  if (step === 'choice') {
    return (
      <div className="fixed inset-0 md:left-[205px] bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 overflow-auto">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 max-w-5xl w-full">
          <button
            onClick={() => setStep('mode-selection')}
            className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Options</span>
          </button>

          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
              Create Your Property Landing Page
            </h1>

            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Upload a property listing PDF and let AI automatically extract all details, then create a stunning landing page.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r bg-blue-600 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

            <div
              onClick={() => setStep('upload')}
              className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-12 cursor-pointer hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-10 h-10 text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Create Landing Page from PDF</h2>
                  <p className="text-gray-400">Upload any property listing PDF to get started</p>
                </div>

                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                  Upload PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Upload Screen
  if (step === 'upload') {
    return (
      <div className="fixed inset-0 md:left-[205px] bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 overflow-auto">
        <div className="w-full max-w-2xl">
          <button
            onClick={() => setStep('choice')}
            className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="relative">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-3xl p-16 transition-all duration-300 ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
                  : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
                disabled={isUploading}
              />

              <div className="flex flex-col items-center text-center space-y-6">
                <div
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                    isDragging
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 scale-110'
                      : 'bg-gradient-to-br from-blue-500/20 to-blue-500/20'
                  }`}
                >
                  <Upload className="w-12 h-12 text-blue-400" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {isDragging ? 'Drop your PDF here' : 'Upload Your Property PDF'}
                  </h3>
                  <p className="text-gray-400">or click to browse files on your computer</p>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Processing...' : 'Choose File'}
                </button>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>Supported format: PDF</p>
                  <p>Maximum file size: 10 MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Processing Screen
  if (step === 'processing') {
    return (
      <div className="fixed inset-0 md:left-[205px] bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 overflow-auto">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin" />
              <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-blue-500 animate-spin" style={{ animationDirection: 'reverse' }} />

              <div className="absolute inset-0 flex items-center justify-center">
                <FileCheck className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Processing Your PDF</h2>
          </div>

          <div className="space-y-3">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{progress}% complete</p>
          </div>

          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Extracting text from PDF</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${progress > 70 ? 'bg-blue-500' : 'bg-slate-600'}`} />
              <span>Preparing landing page data</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 5: Success Screen
  if (step === 'success') {
    return (
      <div className="fixed inset-0 md:left-[205px] bg-gradient-to-br from-slate-950 via-green-950/20 to-black flex items-center justify-center p-4 overflow-auto">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-500 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 1}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-full animate-pulse opacity-50" />
              <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                <FileCheck className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Success!
            </h2>
            <p className="text-gray-400 text-lg">
              Your PDF has been processed successfully
            </p>
            <p className="text-sm text-gray-500">
              File: {uploadedFile?.name}
            </p>
          </div>

          <div className="text-sm text-green-400 font-medium">
            Loading your landing page...
          </div>
        </div>
      </div>
    );
  }

  // Step 6: Error Screen
  if (step === 'error') {
    return (
      <div className="fixed inset-0 md:left-[205px] bg-gradient-to-br from-slate-950 via-red-950/20 to-black flex items-center justify-center p-4 overflow-auto">
        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">File is Not Valid!</h2>
            <p className="text-gray-400">{error}</p>
          </div>

          <div className="flex gap-3 flex-col sm:flex-row">
            <button
              onClick={() => setStep('mode-selection')}
              className="flex-1 px-6 py-3 border border-gray-600 hover:border-gray-500 text-white rounded-lg transition-all duration-300"
            >
              Start Over
            </button>
            <button
              onClick={resetUpload}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}