import React, { useState } from 'react';

const AdminPanel: React.FC = () => {
  const [knowledgeBooks, setKnowledgeBooks] = useState([
    { name: 'Advanced Numerology Course by Raajeev Singh Chauhann.pdf', size: '12.4 MB', status: 'INDEXED & ACTIVATED', date: '2026-06-07' },
    { name: 'Planetary Relations & Remedies Matrix.pdf', size: '4.8 MB', status: 'INDEXED & ACTIVATED', date: '2026-06-07' }
  ]);
  const [newBookName, setNewBookName] = useState('');
  const [editingRemedy, setEditingRemedy] = useState('Lal Kitab Gemstone Remedy: Pukhraj for Conductor (Bhagyank) 3, Ruby for Conductor (Bhagyank) 1.');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookName) return;
    setKnowledgeBooks([
      ...knowledgeBooks,
      { name: newBookName, size: '2.5 MB', status: 'INDEXED & ACTIVATED', date: new Date().toISOString().split('T')[0] }
    ]);
    setNewBookName('');
  };

  return (
    <div id="admin-panel-viewport" className="space-y-8 animate-in fade-in duration-500 text-left">
      
      {/* Knowledge Base Matrix Management */}
      <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wider">Astro-Numerology Knowledge Base Management</h3>
          <span className="text-[10px] font-mono bg-[#10B981]/10 text-[#10B981] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-bold border border-[#10B981]/20">Vedic Engine Active</span>
        </div>
        <p className="text-[#6B7280] text-xs">
          Upload and index proprietary astrology or numerology textbook matrices to feed the AI Report Generator automatically.
        </p>

        {/* Upload form simulate */}
        <form onSubmit={handleUpload} className="flex gap-4 max-w-lg">
          <input
            type="text"
            placeholder="Astro textbook PDF file name..."
            className="flex-1 bg-[#F8F4EF] border border-[#E5E7EB] focus:border-[#D97706] rounded-2xl px-5 py-3 outline-none text-xs text-[#1F2937]"
            value={newBookName}
            onChange={(e) => setNewBookName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-6 py-3 rounded-2xl transition duration-300 text-xs tracking-wider uppercase cursor-pointer"
          >
            Index PDF
          </button>
        </form>

        {/* Textbook lists */}
        <div className="space-y-4 pt-4">
          <h4 className="text-xs uppercase font-mono tracking-widest text-[#D97706] font-bold">Currently Indexed Books & Matrixes</h4>
          <div className="space-y-3">
            {knowledgeBooks.map((book, idx) => (
              <div key={idx} className="p-5 bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl flex justify-between items-center flex-wrap gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-[#1F2937] block">{book.name}</span>
                  <span className="text-[10px] text-[#6B7280] font-mono">Size: {book.size} | Uploaded on: {book.date}</span>
                </div>
                <span className="text-[9px] font-mono bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-3 py-1.5 rounded-full font-bold">
                  {book.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast & Remedies editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Remedy template modifier */}
        <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-4">
          <h3 className="font-playfair text-lg font-bold text-[#1F2937] tracking-wide">Planetary Remedies Template Modifier</h3>
          <p className="text-[#6B7280] text-xs">Edit core formula outputs compiled by the rule engine.</p>
          <div className="space-y-4 pt-2">
            <textarea
              className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl p-4 h-32 focus:border-[#D97706] outline-none text-xs text-[#1F2937] leading-relaxed font-mono"
              value={editingRemedy}
              onChange={(e) => setEditingRemedy(e.target.value)}
            />
            <button
              onClick={() => alert('Remedy templates updated successfully!')}
              className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-6 py-2.5 rounded-xl transition duration-300 text-xs tracking-wider uppercase cursor-pointer"
            >
              Save Formula Base
            </button>
          </div>
        </div>

        {/* Analytics Insights */}
        <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-4">
          <h3 className="font-playfair text-lg font-bold text-[#1F2937] tracking-wide">Synthesized Systems Traffic Analytics</h3>
          <p className="text-[#6B7280] text-xs">Real-time statistics of report requests, downloads, and synastry matches.</p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl">
              <span className="text-xs text-[#6B7280] font-mono block uppercase font-bold">Reports Synced</span>
              <span className="text-3xl font-playfair font-black text-[#D97706] mt-2 block">1,482</span>
            </div>

            <div className="p-4 bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl">
              <span className="text-xs text-[#6B7280] font-mono block uppercase font-bold">Synastry Match</span>
              <span className="text-3xl font-playfair font-black text-[#D97706] mt-2 block">949</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminPanel;
