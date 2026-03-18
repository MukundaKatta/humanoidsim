'use client';

import { useState } from 'react';
import { useStore, TaskDefinition } from '@/lib/store';
import { Plus, Target, Clock, Trophy, ChevronRight, Zap } from 'lucide-react';

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-400 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  hard: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  expert: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const typeColors: Record<string, string> = {
  navigation: 'text-blue-400',
  manipulation: 'text-purple-400',
  interaction: 'text-sim-400',
  assembly: 'text-orange-400',
};

export default function TaskDefinitions() {
  const { tasks, setTasks } = useStore();
  const [selected, setSelected] = useState<TaskDefinition | null>(tasks[0] || null);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Task Definitions</h2>
          <p className="text-sm text-gray-400">Define learning tasks for robot training</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-sim-600 hover:bg-sim-700 rounded-lg text-sm">
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelected(task)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected?.id === task.id ? 'bg-sim-600/20 border-sim-600/30' : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{task.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded border ${difficultyColors[task.difficulty]}`}>{task.difficulty}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{task.description}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className={typeColors[task.type]}>{task.type}</span>
                <span className="text-gray-500">{task.maxTime}s</span>
                <span className="text-yellow-400">{task.reward} pts</span>
              </div>
            </button>
          ))}
        </div>

        {/* Task Detail */}
        <div className="col-span-2">
          {selected ? (
            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{selected.name}</h3>
                    <p className="text-sm text-gray-400">{selected.description}</p>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded border ${difficultyColors[selected.difficulty]}`}>{selected.difficulty}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1"><Target size={14} /> Type</div>
                    <p className={`font-semibold capitalize ${typeColors[selected.type]}`}>{selected.type}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1"><Clock size={14} /> Max Time</div>
                    <p className="font-semibold">{selected.maxTime}s</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1"><Trophy size={14} /> Reward</div>
                    <p className="font-semibold text-yellow-400">{selected.reward} pts</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3">Steps</h4>
                  <div className="space-y-2">
                    {selected.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-3">
                        <div className="w-6 h-6 rounded-full bg-sim-600/20 flex items-center justify-center text-xs text-sim-400 font-bold">{i + 1}</div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2">Success Criteria</h4>
                  <p className="text-sm text-gray-400">{selected.successCriteria}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">Select a task</div>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Create Task</h2>
            <div className="space-y-4">
              <input placeholder="Task Name" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm" />
              <textarea placeholder="Description" rows={2} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm">
                  <option>navigation</option><option>manipulation</option><option>interaction</option><option>assembly</option>
                </select>
                <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm">
                  <option>easy</option><option>medium</option><option>hard</option><option>expert</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-sm">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2 bg-sim-600 rounded-lg text-sm">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
