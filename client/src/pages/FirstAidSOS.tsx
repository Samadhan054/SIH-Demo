import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Navigation, PackagePlus, AlertCircle, CheckCircle } from 'lucide-react';

export const FirstAidSOS: React.FC = () => {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    name: '',
    location: '',
    state: '',
    district: '',
    village: '',
    lat: '',
    lng: '',
    people: 1,
    phone: '',
    description: '',
    notes: ''
  });

  const [status, setStatus] = useState<'IDLE' | 'LOCATING' | 'SUBMITTING' | 'SUCCESS'>('IDLE');
  const [requestId, setRequestId] = useState('');

  const handleLocate = () => {
    setStatus('LOCATING');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormState(prev => ({ ...prev, lat: pos.coords.latitude.toString(), lng: pos.coords.longitude.toString() }));
          setStatus('IDLE');
        },
        () => {
          alert('Location access denied. Please enter manually.');
          setStatus('IDLE');
        }
      );
    } else {
      alert('Geolocation not supported');
      setStatus('IDLE');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SUBMITTING');
    
    // Simulate API call
    setTimeout(() => {
      const id = 'FIRSTAID-' + Math.floor(10000 + Math.random() * 90000);
      setRequestId(id);
      setStatus('SUCCESS');
    }, 1500);
  };

  if (status === 'SUCCESS') {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white border-2 border-emerald-500 rounded-2xl shadow-xl p-8 text-center space-y-6">
          <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto" />
          <div>
            <h2 className="text-3xl font-black text-slate-900">SOS Request Recorded</h2>
            <p className="text-slate-600 mt-2">Help is being coordinated.</p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left space-y-3 max-w-sm mx-auto">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Request ID:</span>
              <span className="font-bold text-slate-900">{requestId}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Nearest Branch:</span>
              <span className="font-bold text-slate-900">Central Rescue HQ</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Transmission:</span>
              <span className="font-bold text-emerald-600">SUCCESS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rescue Status:</span>
              <span className="font-bold bg-amber-100 text-amber-800 px-2 rounded text-sm">NEW</span>
            </div>
          </div>
          
          <button 
            onClick={() => setStatus('IDLE')}
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-4 bg-red-100 text-red-600 rounded-full mb-2">
          <PackagePlus className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">{t('firstAidTitle')}</h1>
        <p className="text-slate-600 font-medium max-w-xl mx-auto">{t('firstAidDescription')}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700">Full Name *</label>
            <input required type="text" className="w-full border border-slate-300 rounded-lg p-3" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700">Location Description *</label>
            <input required type="text" placeholder="Landmark, building, area..." className="w-full border border-slate-300 rounded-lg p-3" value={formState.location} onChange={e => setFormState({...formState, location: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">State *</label>
            <select required className="w-full border border-slate-300 rounded-lg p-3" value={formState.state} onChange={e => setFormState({...formState, state: e.target.value})}>
              <option value="">Select State</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Assam">Assam</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">District</label>
            <input type="text" className="w-full border border-slate-300 rounded-lg p-3" value={formState.district} onChange={e => setFormState({...formState, district: e.target.value})} />
          </div>

          <div className="space-y-2 md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-slate-700">GPS Coordinates</label>
              <button type="button" onClick={handleLocate} disabled={status === 'LOCATING'} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" /> {status === 'LOCATING' ? 'Locating...' : 'Use My Current Location'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Latitude" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-mono" value={formState.lat} onChange={e => setFormState({...formState, lat: e.target.value})} />
              <input type="text" placeholder="Longitude" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-mono" value={formState.lng} onChange={e => setFormState({...formState, lng: e.target.value})} />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Location is being requested to find the nearest rescue center.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Number of People *</label>
            <input required type="number" min="1" className="w-full border border-slate-300 rounded-lg p-3" value={formState.people} onChange={e => setFormState({...formState, people: parseInt(e.target.value)})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Phone Number</label>
            <input type="tel" className="w-full border border-slate-300 rounded-lg p-3" value={formState.phone} onChange={e => setFormState({...formState, phone: e.target.value})} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700">Emergency Description</label>
            <textarea rows={3} className="w-full border border-slate-300 rounded-lg p-3" value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={status === 'SUBMITTING'}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all disabled:opacity-70"
        >
          {status === 'SUBMITTING' ? 'TRANSMITTING...' : 'SEND FIRST AID SOS'}
        </button>
      </form>
    </div>
  );
};
