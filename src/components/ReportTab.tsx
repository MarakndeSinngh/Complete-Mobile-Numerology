import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice, PersonalDetails } from '../types';

interface ReportTabProps {
  personalDetails: PersonalDetails;
  dobData: DOBAnalysis;
  nameData: NameAnalysis;
  mobileData: MobileAnalysis;
  remedies: remediesAdvice;
}

const ReportTab: React.FC<ReportTabProps> = ({ personalDetails, dobData, nameData, mobileData, remedies }) => {
  const [loading, setLoading] = useState(false);
  const [reportText, setReportText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalDetails,
          dobAnalysis: dobData,
          nameAnalysis: nameData,
          mobileAnalysis: mobileData,
          remedies
        })
      });
      const data = await response.json();
      if (data.report) {
        setReportText(data.report);
      } else if (data.error) {
        setErrorMessage(data.error);
      } else {
        setErrorMessage('ब्रह्मांडीय तरंगों में अवरोध है। कृपया कुछ ही क्षणों में पुनः प्रयास करें।');
      }
    } catch (err) {
      setErrorMessage('वैदिक सर्वरों से संपर्क स्थापित नहीं हो पाया। कृपया सुनिश्चित करें कि सेटिंग्स (Settings > Secrets) में आपकी GEMINI_API_KEY भली-भांति दर्ज है।');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!reportText) return;
    
    // Mount report text in the print-only div in index.html to guarantee perfect PDF printing
    let printRoot = document.getElementById('report-print-root');
    if (!printRoot) {
      printRoot = document.createElement('div');
      printRoot.id = 'report-print-root';
      printRoot.className = 'hidden print:block';
      document.body.appendChild(printRoot);
    }
    
    // Render clean luxurious light-mode print document
    printRoot.innerHTML = `
      <div style="background-color: #F8F4EF; color: #1F2937; font-family: 'Inter', system-ui, sans-serif; padding: 40px; border: 2px solid #D97706; border-radius: 30px; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; border-bottom: 2px solid #E5E7EB; padding-bottom: 25px; margin-bottom: 25px;">
          <h2 style="font-family: serif; color: #D97706; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-size: 26px;">
            लियो फैमिली न्यूमरोलॉजी पोर्टल
          </h2>
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #6B7280; font-weight: bold; margin-top: 5px; display: inline-block;">
            पवित्र ब्रह्मांडीय भाग्य और मोबाइल अंक ज्योतिष फलादेश
          </span>
          <p style="font-style: italic; color: #6B7280; margin: 10px 0 0 0; font-size: 13px;">विशेष रूप से तैयार किया गया: ${personalDetails.name}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; background-color: #FFFFFF; padding: 20px; border-radius: 15px; border: 1px solid #E5E7EB; font-size: 13px;">
          <div><strong>आभामंडल नाम (Name):</strong> ${personalDetails.name}</div>
          <div><strong>मोबाईल नंबर (Mobile):</strong> ${personalDetails.mobile}</div>
          <div><strong>मूल जन्म तारीख (DOB):</strong> ${personalDetails.dob}</div>
          <div><strong>ग्रहीय स्पंदन:</strong> भाग्यांक (LP) ${dobData.lifePathNumber} | नामांक (Expression) ${dobData.destinyNumber}</div>
        </div>

        <div style="font-size: 14px; line-height: 1.7; color: #374151;">
          ${reportText.replace(/\n/g, '<br />')}
        </div>
        
        <div style="margin-top: 40px; border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center; font-size: 11px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 2px;">
          राजीव सिंह चौहान पद्धति • प्रमाणित ज्योतिषीय प्रतिवेदन
        </div>
      </div>
    `;
    window.print();
  };

  return (
    <div id="report-generator-panel" className="space-y-8 animate-in fade-in duration-500 text-left">
      
      {!reportText ? (
        <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm text-center space-y-6 max-w-2xl mx-auto py-12">
          <div className="w-16 h-16 rounded-full bg-[#D97706]/10 border border-[#D97706]/20 text-[#D97706] flex items-center justify-center text-3xl mx-auto shadow-md">
            📜
          </div>
          <div className="space-y-2">
            <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wider">वैदिक ज्योतिष-AI दिव्य महा प्रतिवेदन</h3>
            <p className="text-[#6B7280] text-sm max-w-md mx-auto leading-relaxed font-sans">
              अपनी समस्त अंक ज्योतिषीय गणनाओं को एक संयुक्त महा फलादेश प्रतिवेदन में एकत्रित करें। यह प्रतिवेदन प्रमाणित दिव्य ग्रहीय गणनाओं को आधुनिकतम कृत्रिम बुद्धिमत्ता (Gemini AI) से समन्वित कर तैयार किया जाता है।
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs text-left max-w-lg mx-auto font-sans">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className={`w-full md:w-auto bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 text-xs tracking-widest uppercase cursor-pointer ${
                loading ? 'animate-pulse' : ''
              }`}
            >
              {loading ? 'ग्रहीय गणना की जा रही है...' : 'AI पीडीएफ महा प्रतिवेदन निर्मित करें'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">आपका व्यक्तिगत दिव्य महा फलादेश</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setReportText(null)}
                className="bg-[#F2E8DC] hover:bg-[#E5D7C6] text-[#D97706] font-semibold px-5 py-2.5 rounded-xl text-xs transition duration-300 cursor-pointer border border-[#D97706]/20 font-sans"
              >
                पुनः प्रारंभ करें
              </button>
              <button
                onClick={handlePrint}
                className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase transition duration-300 cursor-pointer shadow-sm font-sans"
              >
                प्रिंट करें / पीडीएफ डाउनलोड करें
              </button>
            </div>
          </div>

          <div id="ai-report-body" className="glass-panel p-8 md:p-12 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm text-slate-700 text-sm leading-relaxed prose max-w-none text-left space-y-6">
            <ReactMarkdown>{reportText}</ReactMarkdown>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportTab;
