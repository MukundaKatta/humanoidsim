'use client';

import { useStore } from '@/lib/store';
import { Users, Bot, Zap, MapPin } from 'lucide-react';

const statusColors: Record<string, string> = {
  idle: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  learning: 'bg-sim-500/10 text-sim-400 border-sim-500/20',
  executing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function MultiRobotView() {
  const { robots, tasks, environments } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Multi-Robot Scenarios</h2>
        <p className="text-sm text-gray-400">Monitor and coordinate multiple robots in simulation</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-400">Total Robots</p>
          <p className="text-3xl font-bold text-sim-400">{robots.length}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-400">Active</p>
          <p className="text-3xl font-bold text-blue-400">{robots.filter((r) => r.status !== 'idle').length}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-400">Environments</p>
          <p className="text-3xl font-bold text-purple-400">{environments.length}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-400">Tasks Available</p>
          <p className="text-3xl font-bold text-yellow-400">{tasks.length}</p>
        </div>
      </div>

      {/* Top-down map view */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-4">Simulation Map (Top-Down)</h3>
        <div className="relative bg-gray-800/30 rounded-lg" style={{ height: '400px' }}>
          <svg className="w-full h-full" viewBox="-10 -10 20 20">
            {/* Grid */}
            {Array.from({ length: 21 }).map((_, i) => (
              <g key={i}>
                <line x1={-10} y1={i - 10} x2={10} y2={i - 10} stroke="#1a3a1a" strokeWidth="0.02" />
                <line x1={i - 10} y1={-10} x2={i - 10} y2={10} stroke="#1a3a1a" strokeWidth="0.02" />
              </g>
            ))}
            <line x1={-10} y1={0} x2={10} y2={0} stroke="#2a5a2a" strokeWidth="0.04" />
            <line x1={0} y1={-10} x2={0} y2={10} stroke="#2a5a2a" strokeWidth="0.04" />

            {/* Robots */}
            {robots.map((robot) => (
              <g key={robot.id}>
                <circle
                  cx={robot.position[0]}
                  cy={robot.position[2]}
                  r={0.4}
                  fill={robot.status === 'learning' ? '#4caf50' : robot.status === 'executing' ? '#2196f3' : '#888'}
                  opacity={0.8}
                />
                <circle
                  cx={robot.position[0]}
                  cy={robot.position[2]}
                  r={0.6}
                  fill="none"
                  stroke={robot.status === 'learning' ? '#4caf50' : robot.status === 'executing' ? '#2196f3' : '#888'}
                  strokeWidth="0.05"
                  opacity={0.3}
                />
                <text
                  x={robot.position[0]}
                  y={robot.position[2] + 1}
                  textAnchor="middle"
                  fill="#aaa"
                  fontSize="0.4"
                >
                  {robot.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Robot Cards */}
      <div className="grid grid-cols-3 gap-4">
        {robots.map((robot) => {
          const task = tasks.find((t) => t.id === robot.taskId);
          return (
            <div key={robot.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bot size={18} className="text-sim-400" />
                  <h3 className="font-semibold">{robot.name}</h3>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border ${statusColors[robot.status]}`}>
                  {robot.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Zap size={14} /> <span>Model: {robot.model}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={14} /> <span>Pos: ({robot.position.map((p) => p.toFixed(1)).join(', ')})</span>
                </div>
                {task && (
                  <div className="bg-gray-800/30 rounded-lg p-2 text-xs">
                    <span className="text-gray-500">Current Task: </span>
                    <span className="text-sim-400">{task.name}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
