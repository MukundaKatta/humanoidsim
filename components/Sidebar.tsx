'use client';

import { useStore } from '@/lib/store';
import { Box, Brain, ClipboardList, Video, Users, Shield, ChevronRight } from 'lucide-react';

const navItems = [
  { id: 'environments', label: '3D Environments', icon: Box },
  { id: 'learning', label: 'RL Dashboard', icon: Brain },
  { id: 'tasks', label: 'Task Definitions', icon: ClipboardList },
  { id: 'demonstrations', label: 'Demonstrations', icon: Video },
  { id: 'multi-robot', label: 'Multi-Robot', icon: Users },
  { id: 'safety', label: 'Safety Zones', icon: Shield },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, trainingRuns } = useStore();
  const runningCount = trainingRuns.filter((r) => r.status === 'running').length;

  return (
    <aside className="w-64 bg-gray-900/50 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sim-600 rounded-lg flex items-center justify-center">
            <Brain size={18} />
          </div>
          <span className="font-bold text-lg">HumanoidSim</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive ? 'bg-sim-600/20 text-sim-400 border border-sim-600/30' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'learning' && runningCount > 0 && (
                <span className="bg-sim-500/20 text-sim-400 text-xs px-2 py-0.5 rounded-full animate-pulse">{runningCount}</span>
              )}
              {isActive && <ChevronRight size={14} />}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
        <p>HumanoidSim v1.0.0</p>
        <p className="mt-1">3 environments loaded</p>
      </div>
    </aside>
  );
}
