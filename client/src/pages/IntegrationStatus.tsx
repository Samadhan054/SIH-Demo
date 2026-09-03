import React from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const IntegrationStatus: React.FC = () => {
  const integrations = [
    { name: 'Weather API (IMD)', status: 'CONNECTED', message: 'Syncing every 15 mins', time: 'Just now' },
    { name: 'InSAR Satellite Feed', status: 'DEMO', message: 'Awaiting API Key for Sentinel-1', time: 'N/A' },
    { name: 'Avalanche Radar', status: 'NOT_CONFIGURED', message: 'Hardware integration pending', time: 'N/A' },
    { name: 'Satellite SOS Provider', status: 'CONNECTED', message: 'Iridium Gateway Active', time: '1 min ago' },
    { name: 'SMS Gateway (MSG91)', status: 'CONNECTED', message: 'API Credits: 45,210', time: '10 mins ago' },
    { name: 'Gov Alert Webhook', status: 'ERROR', message: 'Connection timeout', time: '1 hr ago' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'ERROR': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'DEMO': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'NOT_CONFIGURED': return <AlertCircle className="w-5 h-5 text-slate-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ERROR': return 'bg-red-50 text-red-700 border-red-200';
      case 'DEMO': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'NOT_CONFIGURED': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">System Integration Status</h1>
          <p className="text-slate-500 text-sm">Monitor connections to external APIs and hardware</p>
        </div>
        <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-slate-300">
          <RefreshCw className="w-4 h-4" /> Run Diagnostics
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800 flex gap-3">
        <Activity className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p>Configure missing services by setting the appropriate environment variables (e.g., <code>INSAR_API_KEY</code>, <code>AVALANCHE_RADAR_ENDPOINT</code>) and restarting the server.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Service Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Details</th>
              <th className="p-4">Last Checked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {integrations.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                  {getStatusIcon(item.status)} {item.name}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{item.message}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
