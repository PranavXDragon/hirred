"use client";

import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Wand2, Check, XSquare } from 'lucide-react';
import { createClient } from '../../../lib/supabase/client';
import ResumePreviewDummy from './ResumePreviewDummy';

export default function AdminDesignsPanel({ showAlert }) {
  const [designs, setDesigns] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [designName, setDesignName] = useState('');
  const [file, setFile] = useState(null);
  const [editingDesign, setEditingDesign] = useState(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('resume_designs').select('*').order('created_at', { ascending: false });
    if (data) setDesigns(data);
    if (error) console.error('Error fetching designs:', error);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!file || !designName) {
      showAlert('Please provide a name and upload a PDF.');
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      showAlert('Analyzing PDF visually... this may take 10-20 seconds.');
      const res = await fetch('/api/generate-template', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      
      if (!result.success) throw new Error(result.error);
      
      const theme = result.data;
      
      const supabase = createClient();
      // Save to Supabase
      const { data, error } = await supabase.from('resume_designs').insert([{
        name: designName,
        template: theme.template || 'minimalist',
        accent: theme.accent || '#000000',
        font: theme.font || 'font-sans',
        custom_css: theme.custom_css || ''
      }]).select();

      if (error) throw error;
      
      setDesigns([data[0], ...designs]);
      setDesignName('');
      setFile(null);
      showAlert('Theme successfully generated and saved!');
    } catch (error) {
      console.error(error);
      showAlert(`Generation failed: ${error.message}`);
    }
    setIsGenerating(false);
  };

  const handleCreateBlank = async (e) => {
    e.preventDefault();
    if (!designName) {
      showAlert('Please provide a Theme Name first.');
      return;
    }
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('resume_designs').insert([{
        name: designName,
        template: 'minimalist',
        accent: '#000000',
        font: 'sans',
        custom_css: '/* Write your custom layout CSS here */\n'
      }]).select();
      
      if (error) throw error;
      
      setDesigns([data[0], ...designs]);
      setDesignName('');
      setEditingDesign(data[0]);
      showAlert('Blank theme created! You can now design it manually.');
    } catch (error) {
      showAlert(`Creation failed: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('resume_designs').delete().eq('id', id);
      if (error) throw error;
      setDesigns(designs.filter(d => d.id !== id));
      showAlert('Design deleted.');
    } catch (error) {
      showAlert(`Error deleting: ${error.message}`);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const supabase = createClient();
      const { error } = await supabase.from('resume_designs').update({
        name: editingDesign.name,
        template: editingDesign.template,
        accent: editingDesign.accent,
        font: editingDesign.font,
        custom_css: editingDesign.custom_css,
        is_published: editingDesign.is_published !== false
      }).eq('id', editingDesign.id);
      
      if (error) throw error;
      
      setDesigns(designs.map(d => d.id === editingDesign.id ? editingDesign : d));
      setEditingDesign(null);
      showAlert('Theme successfully updated!');
    } catch (error) {
      showAlert(`Update failed: ${error.message}`);
    }
  };

  const togglePublished = async (design) => {
    try {
      const newValue = design.is_published === false ? true : false;
      const supabase = createClient();
      const { error } = await supabase.from('resume_designs').update({ is_published: newValue }).eq('id', design.id);
      if (error) throw error;
      setDesigns(designs.map(d => d.id === design.id ? { ...d, is_published: newValue } : d));
      showAlert(`Theme is now ${newValue ? 'Visible' : 'Hidden'} in builder.`);
    } catch (error) {
      showAlert(`Error toggling visibility: ${error.message}`);
    }
  };

  return (
    <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mt-12">
      <div className="p-6 border-b-4 border-black bg-slate-50 flex items-center justify-between">
        <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
          <Wand2 size={24} className="text-purple-500" /> AI Theme Generator
        </h3>
        <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1">
          {designs.length} Themes
        </span>
      </div>
      
      <div className="p-6 border-b-4 border-black bg-white">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Theme Name</label>
              <input 
                type="text" 
                value={designName}
                onChange={e => setDesignName(e.target.value)}
                placeholder="e.g. Creative Neon" 
                className="w-full border-2 border-black p-3 font-bold text-sm uppercase placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Reference PDF (Optional for AI)</label>
              <input 
                type="file" 
                accept="application/pdf"
                onChange={e => setFile(e.target.files[0])}
                className="w-full border-2 border-black p-2 bg-slate-50 text-xs font-bold cursor-pointer"
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={handleCreateBlank}
                className="bg-white text-black px-4 py-3 font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-slate-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none whitespace-nowrap"
              >
                Create Blank
              </button>
              <button 
                type="submit" 
                disabled={isGenerating}
                className="bg-purple-500 text-white px-6 py-3 font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
              >
                <Wand2 size={14} />
                {isGenerating ? 'Generating...' : 'AI Analyze'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white text-[10px] font-black uppercase tracking-wider divide-x-2 divide-slate-800">
              <th className="p-4">Name</th>
              <th className="p-4">Base Template</th>
              <th className="p-4 text-center">Accent</th>
              <th className="p-4 text-center">CSS Included</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black font-bold text-sm">
            {designs.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors divide-x-2 divide-black">
                <td className="p-4 font-black uppercase text-purple-600">{d.name}</td>
                <td className="p-4 uppercase text-xs">{d.template} ({d.font})</td>
                <td className="p-4 text-center">
                  <div className="w-6 h-6 border-2 border-black mx-auto" style={{ backgroundColor: d.accent }}></div>
                </td>
                <td className="p-4 text-center">
                  {d.custom_css ? <Check className="mx-auto text-emerald-500" size={16} /> : <XSquare className="mx-auto text-slate-300" size={16} />}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => togglePublished(d)}
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none cursor-pointer ${d.is_published !== false ? 'bg-emerald-400 text-black' : 'bg-slate-200 text-slate-500'}`}
                  >
                    {d.is_published !== false ? 'Published' : 'Hidden'}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setEditingDesign(d)}
                      className="p-2 border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none cursor-pointer bg-white hover:bg-sky-500 hover:text-white text-black text-[10px] font-black uppercase"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="p-2 border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none cursor-pointer bg-white hover:bg-red-500 hover:text-white text-black"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {designs.length === 0 && (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-400 font-black uppercase tracking-widest">
                  No Custom Themes Generated Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal with Live Preview */}
      {editingDesign && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(147,51,234,1)] w-full max-w-[95vw] h-[95vh] flex flex-col">
            <div className="p-4 border-b-4 border-black bg-purple-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                Edit Theme: <span className="text-purple-600">{editingDesign.name}</span>
                <span className="text-[10px] bg-black text-white px-2 py-1 ml-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">LIVE PREVIEW</span>
              </h3>
              <button onClick={() => setEditingDesign(null)} className="p-1 hover:bg-black hover:text-white transition-colors cursor-pointer border-2 border-transparent hover:border-black">
                <XSquare size={24} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-6 space-y-6 lg:max-w-xl lg:border-r-4 border-black flex flex-col bg-white">
                <div className="grid grid-cols-2 gap-4 shrink-0">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Theme Name</label>
                    <input 
                      type="text" 
                      value={editingDesign.name}
                      onChange={e => setEditingDesign({...editingDesign, name: e.target.value})}
                      className="w-full border-2 border-black p-3 font-bold text-sm uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Accent Hex</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={editingDesign.accent}
                        onChange={e => setEditingDesign({...editingDesign, accent: e.target.value})}
                        className="w-12 h-12 border-2 border-black cursor-pointer p-0"
                      />
                      <input 
                        type="text" 
                        value={editingDesign.accent}
                        onChange={e => setEditingDesign({...editingDesign, accent: e.target.value})}
                        className="flex-1 border-2 border-black p-3 font-bold text-sm uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 shrink-0">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Base Template</label>
                    <select 
                      value={editingDesign.template}
                      onChange={e => setEditingDesign({...editingDesign, template: e.target.value})}
                      className="w-full border-2 border-black p-3 font-bold text-sm uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="brutalist">Brutalist</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="corporate">Corporate</option>
                      <option value="monotech">Mono Tech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Font Family</label>
                    <select 
                      value={editingDesign.font}
                      onChange={e => setEditingDesign({...editingDesign, font: e.target.value})}
                      className="w-full border-2 border-black p-3 font-bold text-sm uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="sans">SANS (Inter)</option>
                      <option value="serif">SERIF (Playfair)</option>
                      <option value="mono">MONO (JetBrains)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col min-h-[300px]">
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Custom CSS</label>
                  <p className="text-[9px] font-bold text-slate-400 mb-2 leading-tight">
                    Write raw CSS to reshape the layout. Target `#cv-print-area`. For a two-column sidebar layout, try setting `#cv-print-area` to `display: grid; grid-template-columns: 250px 1fr;` and adjusting child elements.
                  </p>
                  <textarea 
                    value={editingDesign.custom_css}
                    onChange={e => setEditingDesign({...editingDesign, custom_css: e.target.value})}
                    className="w-full flex-1 border-2 border-black p-3 font-mono text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-900 text-green-400"
                    placeholder="Enter raw CSS here..."
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t-4 border-black shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editingDesign.is_published !== false}
                      onChange={e => setEditingDesign({...editingDesign, is_published: e.target.checked})}
                      className="w-5 h-5 accent-purple-600 cursor-pointer"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-black">Published to Builder</span>
                  </label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setEditingDesign(null)}
                      className="bg-white text-black px-6 py-3 font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-slate-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-purple-500 text-white px-6 py-3 font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>

              {/* Live Preview Panel */}
              <div className="flex-1 bg-slate-200 overflow-hidden relative border-t-4 lg:border-t-0 border-black">
                <ResumePreviewDummy 
                  template={editingDesign.template}
                  font={editingDesign.font}
                  accent={editingDesign.accent}
                  customCss={editingDesign.custom_css}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
