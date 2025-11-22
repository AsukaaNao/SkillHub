import React from 'react';
import { Mail, Phone, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { ParticipantDetail, Peserta } from '../types';

interface ParticipantsTableProps {
  participants: ParticipantDetail[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onEnroll: (participant: ParticipantDetail) => void;
}

export const ParticipantsTable: React.FC<ParticipantsTableProps> = ({ participants, onEdit, onDelete, onEnroll }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Classes</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {participants.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 text-slate-400 text-xs font-mono">#{p.id}</td>
              <td className="px-6 py-4 font-medium text-slate-900">{p.nama}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {p.email}</div>
                  {p.nomor_telepon && <div className="flex items-center gap-2 text-slate-500"><Phone size={14} className="text-slate-400" /> {p.nomor_telepon}</div>}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {p.enrolledClasses && p.enrolledClasses.length > 0 ? (
                      p.enrolledClasses.map(c => (
                          <span key={c.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {c.nama_kelas}
                          </span>
                      ))
                  ) : (
                      <span className="text-slate-400 text-xs italic">Not enrolled</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onEnroll(p)} className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded hover:bg-emerald-100 transition-colors" title="Enroll in Class">
                      <UserPlus size={14}/> Enroll
                  </button>
                  <button onClick={() => onEdit(p.id)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded" title="Edit"><Edit2 size={16} /></button>
                  <button onClick={() => onDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
          {participants.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No participants found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
