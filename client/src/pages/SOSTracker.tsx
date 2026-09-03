import React, { useState } from 'react';
import { Search, MapPin, Clock, Package } from 'lucide-react';

export const SOSTracker: React.FC = () => {
  const [requestId, setRequestId] = useState('');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestId.startsWith('FIRSTAID-') || requestId.startsWith('SOS-')) {
      setError(false);
      // Mock data
      setData({
        id: requestId,
        status: 'DISPATCHED',
        time: 'Just now',
        nearestCenter: 'Kathmandu Central Rescue HQ',
        timeline: [
          { status: 'SUBMITTED', time: '10:00 AM', desc: 'Request received by system' },
          { status: 'APPROVED', time: '10:05 AM', desc: 'Verified by nearest rescue center' },
          { status: 'DISPATCHED', time: '10:15 AM', desc: 'First aid kit dispatched via drone/team' },
        ]
      });
    } else {
      setError(true);
      setData(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-slate-900">Track Your SOS Request</h1>
        <p className="text-slate-600 font-medium">Enter your request ID to view the current status of your emergency request.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-bold text-slate-700">Request ID</label>
          <input 
            type="text" 
            placeholder="e.g. FIRSTAID-12345"
            className="w-full border border-slate-300 rounded-xl p-3"
            value={requestId}
            onChange={e => setRequestId(e.target.value.toUpperCase())}
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2">
          <Search className="w-5 h-5" /> Track
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center font-bold">
          Invalid Request ID. Please check and try again.
        </div>
      )}

      {data && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <p className="text-sm text-slate-500 font-bold mb-1">Status for Request</p>
              <h2 className="text-2xl font-black text-slate-900">{data.id}</h2>
            </div>
            <div className="bg-amber-100 text-amber-800 border border-amber-300 px-4 py-2 rounded-xl font-black text-lg tracking-wider">
              {data.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <MapPin className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Assigned Center</p>
                <p className="font-bold text-slate-900">{data.nearestCenter}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <Clock className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Last Updated</p>
                <p className="font-bold text-slate-900">{data.time}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-6">
            <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Status History Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {data.timeline.map((item: any, idx: number) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900">{item.status}</h4>
                      <time className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{item.time}</time>
                    </div>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
