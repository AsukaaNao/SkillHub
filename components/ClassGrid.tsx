import React from 'react';
import { Edit2, Trash2, ChevronRight, Users, UserCircle } from 'lucide-react'; // Added UserCircle
import { Kelas } from '../types';

interface ClassGridProps {
  classes: Kelas[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetail: (id: number) => void;
}

export const ClassGrid: React.FC<ClassGridProps> = ({ classes, onEdit, onDelete, onViewDetail }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map(c => (
        <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group relative flex flex-col" onClick={() => onViewDetail(c.id)}>
          
          {/* Hover Actions */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
              <button onClick={() => onEdit(c.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 size={16} /></button>
              <button onClick={() => onDelete(c.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
          </div>

          <h3 className="font-bold text-lg text-slate-800 mb-1 pr-12">{c.nama_kelas}</h3>
          
          {/* NEW: Instructor Display */}
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <UserCircle size={16} className="text-indigo-500"/>
            <span>{c.pengajar || 'Unknown Instructor'}</span>
          </div>

          <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10 flex-1">{c.deskripsi || 'No description provided.'}</p>
          
          {/* Footer Section */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>ID: {c.id}</span>
                {/* Student Count Badge */}
                <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                   <Users size={12} /> 
                   <strong className="text-slate-700">{c.studentCount || 0}</strong> Students
                </span>
              </div>

              <span className="text-xs font-medium text-indigo-600 flex items-center gap-1 hover:underline">
                View <ChevronRight size={12}/>
              </span>
          </div>
        </div>
      ))}
      {classes.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">No classes created yet.</div>
      )}
    </div>
  );
};