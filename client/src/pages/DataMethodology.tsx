import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { DataMethodologyDoc } from '../types';
import { Code2, Edit3, Save, Shield, FileText, CheckCircle2, AlertTriangle, Layers, CloudRain, Waves } from 'lucide-react';

export const DataMethodology: React.FC = () => {
  const { user, token } = useAuth();
  const { t, liteMode } = useLanguage();

  const [doc, setDoc] = useState<DataMethodologyDoc | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form edit states
  const [formulaTitle, setFormulaTitle] = useState('');
  const [formulaDescription, setFormulaDescription] = useState('');
  const [riverThresholdNote, setRiverThresholdNote] = useState('');

  const fetchDoc = async () => {
    try {
      const res = await fetch('/api/data-methodology');
      if (res.ok) {
        const data = await res.json();
        setDoc(data);
        setFormulaTitle(data.formulaTitle);
        setFormulaDescription(data.formulaDescription);
        setRiverThresholdNote(data.riverThresholdModelNote);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.role !== 'ADMIN') return;

    try {
      const res = await fetch('/api/data-methodology', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          formulaTitle,
          formulaDescription,
          riverThresholdModelNote: riverThresholdNote,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setDoc(updated);
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update methodology doc:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
              Government & Rescue Operations Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">Role Access: {user.role}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            System Data & Methodology Specification
          </h1>
        </div>

        {user.role === 'ADMIN' && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Documentation (Admin)'}</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4" />
          Methodology Specification Document Updated Successfully!
        </div>
      )}

      {/* Editable Form (Admin) vs Static Render */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-200">Specification Title:</label>
            <input
              type="text"
              value={formulaTitle}
              onChange={(e) => setFormulaTitle(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-200">RiskScore Formula Description:</label>
            <textarea
              rows={3}
              value={formulaDescription}
              onChange={(e) => setFormulaDescription(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-200">CWC Per-River Threshold Model Notes:</label>
            <textarea
              rows={3}
              value={riverThresholdNote}
              onChange={(e) => setRiverThresholdNote(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Specification Changes</span>
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Extended Risk Engine Formula */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-amber-400" />
              {doc?.formulaTitle || 'Flash Flood Risk Score Engine (0.0 to 1.0)'}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              {doc?.formulaDescription}
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-amber-300 font-bold">Updated Weighted Mathematical Formula:</div>
              <div className="bg-slate-900 p-3 rounded text-cyan-300 overflow-x-auto">
                RiskScore = (0.30 * F_rain) + (0.25 * F_rise) + (0.15 * F_level) + (0.15 * F_threshold) + (0.08 * F_soil) + (0.07 * F_dem)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2">
                <div>• F_rain: Rainfall mm/h vs 70mm/h cloudburst threshold</div>
                <div>• F_rise: Water level rise rate m/h surge</div>
                <div>• F_level: Water level ratio vs station danger level</div>
                <div>• F_threshold: CWC river warning/danger/extreme level breach</div>
                <div>• F_soil: Soil moisture saturation %</div>
                <div>• F_dem: DEM slope gradient & valley narrowness multiplier</div>
              </div>
            </div>
          </section>

          {/* Section 2: Per-River Threshold Model */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Waves className="w-5 h-5 text-cyan-400" />
              Central Water Commission (CWC) River Threshold Model
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {doc?.riverThresholdModelNote}
            </p>
          </section>

          {/* Section 3: Swappable Data Adapters Data Provenance */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Data Adapters Architecture & Source Provenance
            </h2>

            <div className="space-y-3 text-xs">
              {doc?.adapterProvenanceNotes &&
                Object.entries(doc.adapterProvenanceNotes).map(([key, note]) => (
                  <div key={key} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-mono text-cyan-400 font-bold uppercase">{key}:</span>
                    <p className="text-slate-300">{note}</p>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
