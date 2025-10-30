import React, { useEffect, useState } from "react";
import { Loader2, FileDown, TrendingUp, Calendar, Clock, AlertCircle, RefreshCw, Sparkles, BarChart3 } from "lucide-react";

export default function MarketInsight() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
//production deployment
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";


  async function fetchReports() {
    setLoading(true);
    try {
const response = await fetch(`${API_BASE}/api/get-market-reports`);
      const data = await response.json();
          console.log(" Fetched reports:", data);

      setReports(data);
    } catch (err) {
      console.error("Error fetching market reports:", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  }

  useEffect(() => {
    fetchReports();
  }, []);

  const nextScheduledReport = "Friday, 8:00 AM PST";

  return (
<div className="min-h-screen w-full bg-black text-white p-6 overflow-y-auto">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .animate-slide-up { animation: slideUp 0.6s ease-out; }
        .animate-slide-up-delay { animation: slideUp 0.6s ease-out 0.1s backwards; }
        .animate-slide-in { animation: slideIn 0.8s ease-out; }
        .animate-fade-in-up { animation: slideUp 0.8s ease-out; }
        .animate-pulse-slow { animation: pulseSlow 3s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounceSubtle 2s ease-in-out infinite; }
      `}</style>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg animate-pulse-slow">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white animate-slide-up">
                  Market Insights
                </h1>
              </div>
              <p className="text-slate-300 ml-14 animate-slide-up-delay">Automated weekly market analysis and intelligence reports</p>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 border-2 border-slate-600 text-slate-200 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all font-medium disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 mb-6 shadow-xl border border-blue-700 animate-slide-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Next Scheduled Report</span>
              </div>
              <p className="text-xl font-semibold">{nextScheduledReport}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-white">
                <p className="text-sm opacity-90 mb-1">Total Reports</p>
                <p className="text-3xl font-bold">{reports.length}</p>
              </div>
              <div className="h-12 w-px bg-white/30"></div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2.5">
                <p className="text-sm text-white/90 mb-0.5">Auto-save Location</p>
                <p className="font-semibold text-white"> Market Insights</p>
              </div>
            </div>
          </div>
        </div>

        

        {/* Reports List */}
        <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-600 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4 border-b border-slate-500">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileDown className="w-5 h-5" />
              Available Reports
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-slate-300 font-medium">Loading reports...</p>
                <p className="text-slate-400 text-sm mt-1">Please wait while we fetch your data</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-slate-700 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-300 font-medium mb-1">No reports generated yet</p>
                <p className="text-slate-400 text-sm">Reports will be automatically generated every Friday at 8 AM PST</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((r, i) => (
                  <div
                    key={i}
                    className="group relative bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 border-2 border-slate-500 hover:border-blue-400 rounded-xl p-5 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-slate-800 rounded-lg shadow-sm border border-slate-500 group-hover:border-blue-400 transition-colors">
                          <FileDown className="w-6 h-6 text-blue-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-lg mb-1 truncate">
                            {r.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(r.created_at).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(r.created_at).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <a
                        href={r.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                      >
                        <FileDown size={18} />
                        Download PDF
                      </a>
                    </div>

                    {/* Report Number Badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-slate-800 border border-slate-500 rounded-md text-xs font-medium text-slate-300">
                      #{reports.length - i}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 bg-slate-800 border border-slate-600 rounded-lg p-4">
        
        </div>
      </div>
    </div>
  );
}