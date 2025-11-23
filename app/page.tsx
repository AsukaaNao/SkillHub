'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Loader2, Database } from 'lucide-react';
// ... (Keep your imports for services and types) ...
import { ParticipantService } from '../services/participantService';
import { ClassService } from '../services/classService';
import { EnrollmentService } from '../services/enrollmentService';
import { generateDummyParticipants, generateDummyClasses } from '../services/mockDataService';
import { ParticipantFormData, Kelas, ClassFormData, ClassDetail, ParticipantDetail } from '../types';

// ... (Keep your component imports) ...
import { Toast } from '../components/Toast';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { ParticipantModal } from '../components/ParticipantModal';
import { ClassModal } from '../components/ClassModal';
import { EnrollmentModal } from '../components/EnrollmentModal';
import { Sidebar } from '../components/Sidebar';
import { ParticipantsTable } from '../components/ParticipantsTable';
import { ClassGrid } from '../components/ClassGrid';
import { ClassDetailView } from '../components/ClassDetailView';

export default function Home() {
  // ... (Keep other states: activeTab, participants, classes, etc.) ...
  const [activeTab, setActiveTab] = useState<'participants' | 'classes'>('participants');
  const [participants, setParticipants] = useState<ParticipantDetail[]>([]);
  const [classes, setClasses] = useState<Kelas[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<ParticipantDetail[]>([]);
  const [selectedClassDetail, setSelectedClassDetail] = useState<ClassDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  
  const [editingParticipantId, setEditingParticipantId] = useState<number | null>(null);
  const [editingClassId, setEditingClassId] = useState<number | null>(null);
  const [enrollingParticipant, setEnrollingParticipant] = useState<ParticipantDetail | null>(null);

  // 1. UPDATED DELETE STATE
  // Added 'unenroll' to type, and 'secondaryId' to hold the Class ID
  const [deleteState, setDeleteState] = useState<{ 
    isOpen: boolean; 
    type: 'participant' | 'class' | 'unenroll' | null; 
    id: number | null; 
    secondaryId?: number | null; 
  }>({
    isOpen: false, type: null, id: null, secondaryId: null
  });

  // ... (Keep your fetchParticipants and fetchClasses logic) ...
  const fetchParticipants = useCallback(async () => {
    setIsLoading(true);
    const res = await ParticipantService.getAll();
    if (res.success && res.data) {
      setParticipants(res.data);
      setFilteredParticipants(res.data);
    }
    setIsLoading(false);
  }, []);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    const res = await ClassService.getAllKelas();
    if (res.success && res.data) setClasses(res.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchParticipants();
    fetchClasses();
  }, [fetchParticipants, fetchClasses]);
  
  // ... (Keep search useEffect) ...
  useEffect(() => {
    if (activeTab === 'participants') {
      const lower = searchQuery.toLowerCase();
      setFilteredParticipants(participants.filter(p => 
        p.nama.toLowerCase().includes(lower) || p.email.toLowerCase().includes(lower)
      ));
    }
  }, [searchQuery, participants, activeTab]);

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateParticipant = async (data: ParticipantFormData) => {
    // VALIDATION: Check for empty fields
    if (!data.nama?.trim() || !data.email?.trim() || !data.nomor_telepon?.trim()) {
      showToast('Please fill in all participant fields.', 'error');
      return;
    }

    setIsLoading(true);
    const res = await ParticipantService.create(data);
    setIsLoading(false);
    
    if (res.success) {
      showToast('Participant added!', 'success');
      setIsParticipantModalOpen(false);
      fetchParticipants();
    } else {
      showToast(res.error || 'Error adding participant', 'error');
    }
  };

  const handleUpdateParticipant = async (data: ParticipantFormData) => {
    if (!editingParticipantId) return;

    // VALIDATION: Check for empty fields
    if (!data.nama?.trim() || !data.email?.trim() || !data.nomor_telepon?.trim()) {
      showToast('Please fill in all participant fields.', 'error');
      return;
    }

    setIsLoading(true);
    const res = await ParticipantService.update(editingParticipantId, data);
    setIsLoading(false);

    if (res.success) {
      showToast('Participant updated!', 'success');
      setIsParticipantModalOpen(false);
      setEditingParticipantId(null);
      fetchParticipants();
    } else {
      showToast(res.error || 'Error updating participant', 'error');
    }
  };

  const handleCreateClass = async (data: ClassFormData) => {
    // VALIDATION: Check nama_kelas AND pengajar
    if (!data.nama_kelas?.trim() || !data.pengajar?.trim()) {
      showToast('Class name and Instructor are required.', 'error');
      return;
    }

    setIsLoading(true);
    const res = await ClassService.createKelas(data);
    setIsLoading(false);

    if (res.success) {
      showToast('Class created!', 'success');
      setIsClassModalOpen(false);
      fetchClasses();
    } else {
      showToast(res.error || 'Error creating class', 'error');
    }
  };

  const handleUpdateClass = async (data: ClassFormData) => {
    if (!editingClassId) return;

    // VALIDATION: Check nama_kelas AND pengajar
    if (!data.nama_kelas?.trim() || !data.pengajar?.trim()) {
      showToast('Class name and Instructor are required.', 'error');
      return;
    }

    setIsLoading(true);
    const res = await ClassService.updateKelas(editingClassId, data);
    setIsLoading(false);

    if (res.success) {
      showToast('Class updated!', 'success');
      setIsClassModalOpen(false);
      setEditingClassId(null);
      fetchClasses();
    } else {
      showToast(res.error || 'Error updating class', 'error');
    }
  };

  const handleViewClassDetail = async (id: number) => {
    setIsLoading(true);
    const res = await ClassService.getKelasById(id);
    setIsLoading(false);
    if (res.success && res.data) {
        setSelectedClassDetail(res.data);
    } else {
        showToast(res.error || 'Failed to load details', 'error');
    }
  };

  // --- DELETE HANDLERS ---

  // Handler triggered by ClassDetailView
  const handleRemoveStudentTrigger = (classId: number, studentId: number) => {
    setDeleteState({
      isOpen: true,
      type: 'unenroll',
      id: studentId,     // Main ID is Student
      secondaryId: classId // Secondary ID is Class
    });
  };

  // 2. UPDATED EXECUTE DELETE
  const executeDelete = async () => {
    const { type, id, secondaryId } = deleteState;
    if (!type || !id) return;

    setIsLoading(true);
    let res;

    if (type === 'participant') {
      res = await ParticipantService.delete(id);
      if (res.success) {
        showToast('Participant deleted.', 'success');
        fetchParticipants();
      }
    } else if (type === 'class') {
      res = await ClassService.deleteKelas(id);
      if (res.success) {
        showToast('Class deleted.', 'success');
        fetchClasses();
        if (selectedClassDetail?.id === id) setSelectedClassDetail(null);
      }
    } else if (type === 'unenroll' && secondaryId) {
      // CASE: Unenroll Student
      res = await EnrollmentService.deleteEnrollment(id, secondaryId);
      if (res.success) {
        showToast('Student removed from class.', 'success');
        handleViewClassDetail(secondaryId); // Refresh Detail View
        fetchParticipants(); // Refresh main list to update counts
        fetchClasses();
      }
    }

    setIsLoading(false);
    if (res?.success) {
      setDeleteState({ isOpen: false, type: null, id: null, secondaryId: null });
    } else {
      showToast(res?.error || 'Delete failed', 'error');
    }
  };

  // ... (Keep Enrollment Handlers) ...
  const handleOpenEnroll = (p: ParticipantDetail) => {
    setEnrollingParticipant(p);
    setIsEnrollModalOpen(true);
  };

  const handleEnrollSubmit = async (classIds: number[]) => {
    if (!enrollingParticipant) return;
    setIsLoading(true);
    const res = await EnrollmentService.createEnrollment(enrollingParticipant.id, classIds);
    setIsLoading(false);
    if (res.success) {
      showToast(res.message || 'Enrolled successfully!', 'success');
      setIsEnrollModalOpen(false);
      fetchParticipants();
    } else {
      showToast(res.error || 'Enrollment failed', 'error');
    }
  };

  // ... (Keep Dummy Data Handler) ...
  const handlePopulateDummy = async () => {
    setIsGenerating(true);
    try {
      if (activeTab === 'participants') {
        const res = await ParticipantService.bulkInsert(generateDummyParticipants(5));
        if (res.success) {
          showToast(`Added ${res.data?.length} participants!`, 'success');
          fetchParticipants();
        }
      } else {
        const res = await ClassService.bulkInsert(generateDummyClasses(4));
        if (res.success) {
          showToast(`Added ${res.data?.length} classes!`, 'success');
          fetchClasses();
        }
      }
    } catch (e) { showToast('Failed to generate data', 'error'); }
    setIsGenerating(false);
  };

  // 3. HELPER FUNCTIONS FOR MODAL TEXT
  const getModalTitle = () => {
    if (deleteState.type === 'participant') return 'Delete Participant';
    if (deleteState.type === 'class') return 'Delete Class';
    if (deleteState.type === 'unenroll') return 'Remove Student';
    return 'Confirm Delete';
  };

  const getModalMessage = () => {
    if (deleteState.type === 'participant') return 'Are you sure you want to delete this participant?';
    if (deleteState.type === 'class') return 'Are you sure? This will also delete all enrollment records.';
    if (deleteState.type === 'unenroll') return 'Are you sure you want to remove this student from this class?';
    return 'Are you sure?';
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* MODALS */}
      <ConfirmationModal 
        isOpen={deleteState.isOpen}
        onClose={() => setDeleteState({ isOpen: false, type: null, id: null, secondaryId: null })}
        onConfirm={executeDelete}
        title={getModalTitle()}
        message={getModalMessage()}
        isLoading={isLoading}
      />
      
      <ParticipantModal 
        isOpen={isParticipantModalOpen} 
        onClose={() => setIsParticipantModalOpen(false)}
        onSubmit={editingParticipantId ? handleUpdateParticipant : handleCreateParticipant}
        initialData={editingParticipantId ? participants.find(p => p.id === editingParticipantId) : null}
        isLoading={isLoading}
      />
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSubmit={editingClassId ? handleUpdateClass : handleCreateClass}
        initialData={editingClassId ? classes.find(c => c.id === editingClassId) : null}
        isLoading={isLoading}
      />
      <EnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        participant={enrollingParticipant}
        classes={classes}
        onSubmit={handleEnrollSubmit}
        isLoading={isLoading}
      />

      {/* SIDEBAR */}
      <Sidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSelectedClassDetail(null); }} />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 flex-shrink-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {activeTab === 'participants' ? 'Participant Management' : 'Class Management'}
          </h2>
          {/* <div className="hidden md:flex items-center text-sm text-slate-500 gap-2 bg-slate-100 px-3 py-1 rounded-full">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             Backend Connected
          </div> */}
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* CONTROLS */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {activeTab === 'participants' && (
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" placeholder="Search participants..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}
              {activeTab === 'classes' && !selectedClassDetail && <div className="text-slate-500">Manage your course offerings</div>}
              {activeTab === 'classes' && selectedClassDetail && (
                  <button onClick={() => setSelectedClassDetail(null)} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600">
                      <div className="bg-white p-1 rounded shadow-sm border">←</div> Back to List
                  </button>
              )}

              <div className="flex items-center gap-3 ml-auto">
                <button onClick={handlePopulateDummy} disabled={isGenerating} className="px-4 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 flex items-center gap-2">
                  {isGenerating ? <Loader2 className="animate-spin" size={18}/> : <Database size={18} />} <span>Add Dummy Data</span>
                </button>
                
                <button 
                  onClick={() => activeTab === 'participants' ? (setEditingParticipantId(null), setIsParticipantModalOpen(true)) : (setEditingClassId(null), setIsClassModalOpen(true))}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Plus size={20} />
                  <span>Add {activeTab === 'participants' ? 'Participant' : 'Class'}</span>
                </button>
              </div>
            </div>

            {/* VIEW: PARTICIPANTS */}
            {activeTab === 'participants' && (
              <ParticipantsTable 
                participants={filteredParticipants}
                onEdit={(id) => { setEditingParticipantId(id); setIsParticipantModalOpen(true); }}
                onDelete={(id) => { setDeleteState({ isOpen: true, type: 'participant', id, secondaryId: null }); }}
                onEnroll={handleOpenEnroll}
              />
            )}

            {/* VIEW: CLASSES GRID */}
            {activeTab === 'classes' && !selectedClassDetail && (
              <ClassGrid 
                classes={classes}
                onEdit={(id) => { setEditingClassId(id); setIsClassModalOpen(true); }}
                onDelete={(id) => { setDeleteState({ isOpen: true, type: 'class', id, secondaryId: null }); }}
                onViewDetail={handleViewClassDetail}
              />
            )}

            {/* VIEW: CLASS DETAIL */}
            {activeTab === 'classes' && selectedClassDetail && (
              <ClassDetailView 
                detail={selectedClassDetail} 
                onRemoveStudent={handleRemoveStudentTrigger} 
              />
            )}

          </div>
        </div>
      </main>
    </div>
  );
}