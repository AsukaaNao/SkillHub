import React from 'react';
import { Users, Trash2, Mail, UserCircle } from 'lucide-react'; // Added UserCircle
import { ClassDetail } from '../types';

interface ClassDetailViewProps {
  detail: ClassDetail;
  // Parent handles the modal logic
  onRemoveStudent: (classId: number, studentId: number) => void;
}

export const ClassDetailView: React.FC<ClassDetailViewProps> = ({ detail, onRemoveStudent }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 bg-slate-50 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">{detail.nama_kelas}</h2>
          
          {/* NEW: Instructor Info */}
          <div className="flex items-center gap-2 text-slate-700 mt-2 font-medium">
            <UserCircle size={18} className="text-indigo-600"/>
            <span>Instructor: {detail.pengajar || 'Not Assigned'}</span>
          </div>

          <div className="mt-2 flex gap-4 text-sm">
              <span className="text-slate-600">{detail.deskripsi}</span>
          </div>
      </div>
      <div className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Users size={20}/> Enrolled Students ({detail.peserta.length})
          </h3>
          
          {/* ... (Rest of the component remains the same) ... */}
          {detail.peserta.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {detail.peserta.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 group transition-colors">
                          <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                  {p.nama.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                  <p className="font-medium text-sm text-slate-900 truncate">{p.nama}</p>
                                  <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Mail size={10} /> 
                                    <span className="truncate">{p.email}</span>
                                  </div>
                              </div>
                          </div>
                          
                          {/* BUTTON: Triggers the Parent's Modal Handler */}
                          <button 
                            onClick={() => onRemoveStudent(detail.id, p.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Remove from class"
                          >
                            <Trash2 size={16} />
                          </button>
                      </div>
                  ))}
              </div>
          ) : (
              <p className="text-slate-500 italic">No students enrolled in this class yet.</p>
          )}
      </div>
    </div>
  );
};