import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { Kelas, ClassFormData } from '../types';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  initialData?: Kelas | null;
  isLoading: boolean;
}

export const ClassModal: React.FC<ClassModalProps> = ({ 
  isOpen, onClose, onSubmit, initialData, isLoading 
}) => {
  const [formData, setFormData] = useState<ClassFormData>({ nama_kelas: '', deskripsi: '' });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({ nama_kelas: initialData.nama_kelas, deskripsi: initialData.deskripsi || '' });
    } else {
      setFormData({ nama_kelas: '', deskripsi: '' });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">{initialData ? 'Edit Class' : 'New Class'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Class Name <span className="text-red-500">*</span></label>
            <input type="text" value={formData.nama_kelas} onChange={e => setFormData({...formData, nama_kelas: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900" placeholder="e.g. Desain Grafis" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900" rows={3} placeholder="Class description..." />
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
          <button onClick={() => onSubmit(formData)} disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
          </button>
        </div>
      </div>
    </div>
  );
};
