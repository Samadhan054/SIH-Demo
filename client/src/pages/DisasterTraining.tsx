import React from 'react';
import { PlayCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DisasterTraining: React.FC = () => {
  const { t } = useLanguage();

  const videos = [
    { id: 1, title: 'How to survive a Flash Flood', duration: '5:30', category: 'Flash Flood', verified: true, img: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=600&h=400' },
    { id: 2, title: 'Emergency First Aid Basics', duration: '8:45', category: 'First Aid', verified: true, img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600&h=400' },
    { id: 3, title: 'Landslide Warning Signs', duration: '4:15', category: 'Landslide', verified: true, img: 'https://images.unsplash.com/photo-1623863458639-50c180eb9a55?auto=format&fit=crop&q=80&w=600&h=400' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center space-y-3 pt-6">
        <h1 className="text-3xl font-black text-slate-900">{t('trainingTitle')}</h1>
        <p className="text-slate-600 font-medium max-w-2xl mx-auto">Learn crucial survival skills and emergency response protocols before disaster strikes.</p>
      </div>

      {/* Hero Video */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-slate-200">
        <img src={videos[0].img} alt="Hero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Featured</span>
            <span className="bg-white/20 backdrop-blur text-white px-2 py-1 rounded text-xs font-bold">{videos[0].duration}</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">{videos[0].title}</h2>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <ShieldCheck className="w-4 h-4" /> Government Verified Protocol
          </div>
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 group-hover:text-white group-hover:scale-110 transition-all">
            <PlayCircle className="w-20 h-20 drop-shadow-xl" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {videos.map(v => (
          <div key={v.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-lg transition-all group cursor-pointer">
            <div className="relative h-48 overflow-hidden">
              <img src={v.img} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                {v.duration}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">{v.category}</span>
                {v.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" aria-label="Govt Verified" />}
              </div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">{v.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
