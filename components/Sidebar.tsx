import React from 'react';
import { Server, Users, BookOpen } from 'lucide-react';

interface SidebarProps {
  activeTab: 'participants' | 'classes';
  onTabChange: (tab: 'participants' | 'classes') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-lg"><Server size={20} className="text-white" /></div>
          <h1 className="text-xl font-bold tracking-tight">SkillHub <span className="text-indigo-400 text-sm block font-normal">Skill Courses</span></h1>
        </div>
      </div>
      <nav className="p-4 space-y-2 flex-1">
        <button 
          onClick={() => onTabChange('participants')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${activeTab === 'participants' ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : 'border-transparent hover:bg-slate-800 text-slate-400'}`}
        >
          <Users size={20} />
          <span className="font-medium">Participants</span>
        </button>
        <button 
          onClick={() => onTabChange('classes')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${activeTab === 'classes' ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : 'border-transparent hover:bg-slate-800 text-slate-400'}`}
        >
          <BookOpen size={20} />
          <span className="font-medium">Classes</span>
        </button>
      </nav>
    </aside>
  );
};
