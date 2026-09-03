import React, { useState } from 'react';
import { Package, User, MapPin, CheckCircle, Truck, XCircle } from 'lucide-react';

export const FirstAidManagement: React.FC = () => {
  const [requests, setRequests] = useState([
    { id: 'FA-1029', name: 'Ram Bahadur', location: 'Melamchi Bazar', people: 4, emergency: 'Minor cuts, need bandages', time: '10 mins ago', status: 'NEW', priority: 'HIGH' },
    { id: 'FA-1028', name: 'Sita Sharma', location: 'Chautara', people: 2, emergency: 'Fever and cold', time: '1 hr ago', status: 'DISPATCHED', priority: 'MEDIUM' }
  ]);

  const updateStatus = (id: string, status: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">First Aid Kit Management</h1>
          <p className="text-slate-500 text-sm">Review and dispatch incoming first aid SOS requests</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Package className="w-4 h-4" /> HQ Inventory: 420 Kits
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Request ID & Time</th>
              <th className="p-4">Citizen Info</th>
              <th className="p-4">Emergency Details</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {requests.map(req => (
              <tr key={req.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{req.id}</div>
                  <div className="text-xs text-slate-500 mt-1">{req.time}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold flex items-center gap-1"><User className="w-3.5 h-3.5" /> {req.name}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {req.location} ({req.people} ppl)</div>
                </td>
                <td className="p-4">
                  <span className="text-xs">{req.emergency}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${req.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                    {req.priority}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs border border-slate-300">
                    {req.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {req.status === 'NEW' && (
                    <button onClick={() => updateStatus(req.id, 'APPROVED')} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg border border-emerald-200" title="Approve">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {req.status === 'APPROVED' && (
                    <button onClick={() => updateStatus(req.id, 'DISPATCHED')} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg border border-blue-200" title="Dispatch">
                      <Truck className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => updateStatus(req.id, 'FAILED')} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg border border-red-200" title="Unable to fulfil">
                    <XCircle className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
