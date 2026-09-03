import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SafetyDisclaimer: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('floodguard_disclaimer_dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('floodguard_disclaimer_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-slate-100 border-b border-slate-300 px-4 py-2 text-xs text-slate-600 flex items-start sm:items-center justify-between gap-4 z-40 relative">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5 sm:mt-0" />
        <p className="leading-relaxed">
          {t('safetyDisclaimer') || 'This platform supports disaster awareness and emergency coordination. AI-generated or model-based risk estimates are advisory and should not replace official warnings from government disaster-management, meteorological, geological, or emergency-response authorities. In an emergency, follow instructions issued by authorized local agencies.'}
        </p>
      </div>
      <button 
        onClick={handleDismiss}
        className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors shrink-0"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
