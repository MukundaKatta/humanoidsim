'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Video, Play, Pause, SkipBack, Star, Clock, Download } from 'lucide-react';

export default function DemonstrationPanel() {
  const { demonstrations, tasks, robots } = useStore();
  const [selectedDemo, setSelectedDemo] = useState(demonstrations[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Learning from Demonstration</h2>
        <p className="text-sm text-gray-400">Record, review, and train from expert demonstrations</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Demo list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Recorded Demonstrations</h3>
            <button className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Record
            </button>
          </div>
          {demonstrations.map((demo) => {
            const task = tasks.find((t) => t.id === demo.taskId);
            const robot = robots.find((r) => r.id === demo.robotId);
            return (
              <button
                key={demo.id}
                onClick={() => { setSelectedDemo(demo); setCurrentFrame(0); }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedDemo?.id === demo.id ? 'bg-sim-600/20 border-sim-600/30' : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Video size={14} className="text-sim-400" />
                  <span className="font-medium text-sm">{task?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{robot?.name}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{demo.duration}s</span>
                  <span className="flex items-center gap-1"><Star size={10} className="text-yellow-400" />{(demo.quality * 100).toFixed(0)}%</span>
                </div>
              </button>
            );
          })}
          {demonstrations.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">No demonstrations recorded yet</p>
          )}
        </div>

        {/* Demo Viewer */}
        <div className="col-span-2 space-y-4">
          {selectedDemo ? (
            <>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Demonstration Playback</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Frame {currentFrame + 1}/{selectedDemo.frames.length}</span>
                    <span>|</span>
                    <span>{selectedDemo.frames[currentFrame]?.timestamp.toFixed(2)}s</span>
                  </div>
                </div>

                {/* Playback controls */}
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => setCurrentFrame(0)} className="p-2 bg-gray-800/50 rounded-lg text-gray-400 hover:text-white">
                    <SkipBack size={16} />
                  </button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-sim-600 rounded-lg">
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <div className="flex-1">
                    <input
                      type="range" min={0} max={selectedDemo.frames.length - 1} value={currentFrame}
                      onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-sim-500"
                    />
                  </div>
                </div>

                {/* Frame data visualization */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/30 rounded-lg p-3">
                    <h4 className="text-xs text-gray-500 mb-2">Position</h4>
                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex justify-between"><span className="text-gray-400">X:</span><span className="text-sim-400">{selectedDemo.frames[currentFrame]?.position[0].toFixed(3)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Y:</span><span className="text-sim-400">{selectedDemo.frames[currentFrame]?.position[1].toFixed(3)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Z:</span><span className="text-sim-400">{selectedDemo.frames[currentFrame]?.position[2].toFixed(3)}</span></div>
                    </div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-3">
                    <h4 className="text-xs text-gray-500 mb-2">Joints</h4>
                    <div className="space-y-1 font-mono text-xs">
                      {Object.entries(selectedDemo.frames[currentFrame]?.joints || {}).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-gray-400">{k}:</span>
                          <span className="text-blue-400">{(v as number).toFixed(1)}&deg;</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trajectory visualization */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-3">Trajectory Path</h3>
                <div className="h-32 relative bg-gray-800/30 rounded-lg overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    <polyline
                      fill="none"
                      stroke="#4caf50"
                      strokeWidth="0.5"
                      points={selectedDemo.frames.map((f, i) => {
                        const x = (i / selectedDemo.frames.length) * 100;
                        const y = 25 + f.position[0] * 10;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    <circle
                      cx={(currentFrame / selectedDemo.frames.length) * 100}
                      cy={25 + (selectedDemo.frames[currentFrame]?.position[0] || 0) * 10}
                      r="1.5" fill="#66bb6a"
                    />
                  </svg>
                </div>
              </div>

              {/* Quality metrics */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-3">Quality Metrics</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-sim-400">{(selectedDemo.quality * 100).toFixed(0)}%</p>
                    <p className="text-xs text-gray-500">Overall Quality</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{selectedDemo.frames.length}</p>
                    <p className="text-xs text-gray-500">Total Frames</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{selectedDemo.duration.toFixed(1)}s</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">{(selectedDemo.frames.length / selectedDemo.duration).toFixed(0)}</p>
                    <p className="text-xs text-gray-500">FPS</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">Select or record a demonstration</div>
          )}
        </div>
      </div>
    </div>
  );
}
