import React from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

export const TrainingAdmin: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Training Video Management</h1>
          <p className="text-slate-500 text-sm">Upload and manage disaster awareness content</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add Video
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Language</th>
              <th className="p-4">Verified</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="p-4 font-bold text-slate-900">How to survive a Flash Flood</td>
              <td className="p-4">Flash Flood</td>
              <td className="p-4">English</td>
              <td className="p-4"><span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Yes</span></td>
              <td className="p-4 text-right space-x-2">
                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                <button className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
