'use client';

import { useState } from 'react';
import { useStore, TrainingRun } from '@/lib/store';
import { Brain, Play, Pause, Square, TrendingUp, Target, Clock, Zap } from 'lucide-react';

export default function LearningDashboard() {
  const { trainingRuns, tasks, updateTrainingRun } = useStore();
  const [selectedRun, setSelectedRun] = useState<TrainingRun | null>(trainingRuns[0] || null);

  const handleToggle = (run: TrainingRun) => {
    if (run.status === 'running') {
      updateTrainingRun(run.id, { status: 'paused' });
    } else if (run.status === 'paused') {
      updateTrainingRun(run.id, { status: 'running' });
    }
  };

  const handleStop = (run: TrainingRun) => {
    updateTrainingRun(run.id, { status: 'completed' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">RL Dashboard</h2>
        <p className="text-sm text-gray-400">Monitor and control reinforcement learning training runs</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Runs', value: trainingRuns.filter((r) => r.status === 'running').length, icon: Zap, color: 'text-sim-400' },
          { label: 'Best Reward', value: Math.max(...trainingRuns.map((r) => r.reward), 0).toFixed(0), icon: TrendingUp, color: 'text-yellow-400' },
          { label: 'Avg Success', value: (trainingRuns.reduce((a, r) => a + r.successRate, 0) / Math.max(trainingRuns.length, 1)).toFixed(1) + '%', icon: Target, color: 'text-blue-400' },
          { label: 'Total Episodes', value: trainingRuns.reduce((a, r) => a + r.episodes, 0).toLocaleString(), icon: Clock, color: 'text-purple-400' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={16} className={s.color} />
              <span className="text-sm text-gray-400">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Training Runs List */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3">Training Runs</h3>
          <div className="space-y-3">
            {trainingRuns.map((run) => {
              const task = tasks.find((t) => t.id === run.taskId);
              return (
                <button
                  key={run.id}
                  onClick={() => setSelectedRun(run)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedRun?.id === run.id ? 'bg-sim-600/20 border-sim-600/30' : 'bg-gray-800/30 border-transparent hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{task?.name || 'Unknown Task'}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      run.status === 'running' ? 'bg-sim-500/20 text-sim-400' :
                      run.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      run.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {run.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {run.algorithm} | {run.episodes}/{run.maxEpisodes} episodes
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sim-500 rounded-full" style={{ width: `${(run.episodes / run.maxEpisodes) * 100}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Training Details */}
        <div className="col-span-2 space-y-4">
          {selectedRun ? (
            <>
              {/* Controls */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{tasks.find((t) => t.id === selectedRun.taskId)?.name}</h3>
                    <p className="text-sm text-gray-400">{selectedRun.algorithm} - Episode {selectedRun.episodes}/{selectedRun.maxEpisodes}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(selectedRun)}
                      className={`p-2 rounded-lg ${selectedRun.status === 'running' ? 'bg-yellow-600/20 text-yellow-400' : 'bg-sim-600/20 text-sim-400'}`}
                    >
                      {selectedRun.status === 'running' ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button onClick={() => handleStop(selectedRun)} className="p-2 bg-red-600/20 text-red-400 rounded-lg">
                      <Square size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Reward</p>
                  <p className="text-2xl font-bold text-sim-400">{selectedRun.reward.toFixed(1)}</p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-400">{selectedRun.successRate.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Progress</p>
                  <p className="text-2xl font-bold text-purple-400">{((selectedRun.episodes / selectedRun.maxEpisodes) * 100).toFixed(0)}%</p>
                </div>
              </div>

              {/* Reward Chart */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-3">Reward Over Episodes</h3>
                <div className="h-40 flex items-end gap-px">
                  {selectedRun.history.map((h, i) => {
                    const normalized = (h.reward + 100) / 350;
                    return (
                      <div key={i} className="flex-1 group relative">
                        <div
                          className="w-full rounded-t bg-sim-500/40 group-hover:bg-sim-400/60 transition-colors"
                          style={{ height: `${Math.max(2, normalized * 100)}%` }}
                        />
                        <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded z-10 whitespace-nowrap">
                          Ep {h.episode}: {h.reward.toFixed(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Success Rate Chart */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-3">Success Rate Over Episodes</h3>
                <div className="h-32 flex items-end gap-px">
                  {selectedRun.history.map((h, i) => (
                    <div key={i} className="flex-1 group relative">
                      <div
                        className="w-full rounded-t bg-blue-500/40 group-hover:bg-blue-400/60 transition-colors"
                        style={{ height: `${Math.max(2, h.successRate)}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">Select a training run</div>
          )}
        </div>
      </div>
    </div>
  );
}
