import React, { useState, useEffect } from 'react';
import { X, Loader2, UserPlus, Check, BookOpen, AlertCircle } from 'lucide-react';
// CHANGE: Use ParticipantDetail to get access to 'enrolledClasses'
import { ParticipantDetail, Kelas } from '../types'; 

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantDetail | null; // Updated type
  classes: Kelas[];
  onSubmit: (classIds: number[]) => void;
  isLoading: boolean;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen, onClose, participant, classes, onSubmit, isLoading
}) => {
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);

  // Reset selection when modal opens
  useEffect(() => {
    setSelectedClasses([]);
  }, [isOpen, participant]);

  // Helper: Check if this participant is already in this class
  const isAlreadyEnrolled = (classId: number) => {
    // Use optional chaining in case enrolledClasses is undefined
    return participant?.enrolledClasses?.some((c: any) => c.id === classId);
  };

  const toggleClass = (id: number) => {
    if (isAlreadyEnrolled(id)) return; // Prevent selecting if already enrolled
    setSelectedClasses(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  if (!isOpen || !participant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Enroll Participant</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Student: <span className="font-medium text-indigo-600">{participant.nama}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20}/>
          </button>
        </div>

        {/* Body: Class List */}
        <div className="p-6 overflow-y-auto flex-1">
          <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center justify-between">
            <span>Select Classes to Enroll:</span>
            {selectedClasses.length > 0 && (
              <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {selectedClasses.length} selected
              </span>
            )}
          </h4>
          
          <div className="space-y-2.5">
            {classes.map(c => {
              const isEnrolled = isAlreadyEnrolled(c.id);
              const isSelected = selectedClasses.includes(c.id);

              return (
                <div key={c.id} 
                  onClick={() => toggleClass(c.id)}
                  className={`
                    relative p-3 border rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between group
                    ${isEnrolled 
                      ? 'bg-emerald-50/80 border-emerald-100 cursor-not-allowed opacity-90' 
                      : isSelected 
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm bg-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Class Icon / Badge */}
                    <div className={`p-2 rounded-lg ${isEnrolled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                       <BookOpen size={16} />
                    </div>
                    
                    <div>
                      <p className={`font-medium text-sm ${isEnrolled ? 'text-emerald-900' : 'text-slate-900'}`}>
                        {c.nama_kelas}
                      </p>
                      {/* Description or Status */}
                      {isEnrolled ? (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Check size={10} className="text-emerald-600" strokeWidth={4} />
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Already Enrolled</span>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 line-clamp-1">{c.deskripsi || "No description"}</p>
                      )}
                    </div>
                  </div>

                  {/* Checkbox Indicator */}
                  {isEnrolled ? (
                    // <span className="text-xs font-medium text-emerald-600 px-2 py-1 bg-white rounded border border-emerald-100">Joined</span>
                    <div className="w-5 h-5 flex items-center justify-center">
                         <Check size={18} className="text-emerald-500" />
                    </div>
                  ) : (
                    <div className={`
                      w-5 h-5 rounded-md border flex items-center justify-center transition-all
                      ${isSelected ? 'bg-indigo-500 border-indigo-500 scale-110' : 'border-slate-300 group-hover:border-indigo-300'}
                    `}>
                      {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                  )}
                </div>
              );
            })}

            {classes.length === 0 && (
               <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <AlertCircle className="mx-auto mb-2 text-slate-400" size={24} />
                  <p className="text-sm italic">No classes available.</p>
               </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 flex-shrink-0 border-t border-slate-100">
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSubmit(selectedClasses)} 
            disabled={isLoading || selectedClasses.length === 0} 
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />} 
            {selectedClasses.length > 0 ? `Enroll (${selectedClasses.length})` : 'Enroll Selected'}
          </button>
        </div>
      </div>
    </div>
  );
};