'use client';

import { useState } from 'react';
import { useStore, SafetyZone, Environment } from '@/lib/store';
import { Shield, Plus, Trash2, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

const zoneTypeConfig: Record<string, { color: string; bg: string; icon: any }> = {
  restricted: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle },
  caution: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: AlertCircle },
  safe: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle },
};

export default function SafetyZoneEditor() {
  const { environments, setEnvironments, selectedEnv, setSelectedEnv } = useStore();
  const [editingZone, setEditingZone] = useState<SafetyZone | null>(null);
  const env = selectedEnv || environments[0];

  const updateZone = (envId: string, zoneId: string, updates: Partial<SafetyZone>) => {
    const updated = environments.map((e) => {
      if (e.id !== envId) return e;
      return {
        ...e,
        safetyZones: e.safetyZones.map((z) => (z.id === zoneId ? { ...z, ...updates } : z)),
      };
    });
    setEnvironments(updated);
  };

  const addZone = (envId: string) => {
    const newZone: SafetyZone = {
      id: `sz${Date.now()}`,
      name: 'New Zone',
      type: 'safe',
      center: [0, 0, 0],
      radius: 1,
    };
    const updated = environments.map((e) => {
      if (e.id !== envId) return e;
      return { ...e, safetyZones: [...e.safetyZones, newZone] };
    });
    setEnvironments(updated);
    setEditingZone(newZone);
  };

  const removeZone = (envId: string, zoneId: string) => {
    const updated = environments.map((e) => {
      if (e.id !== envId) return e;
      return { ...e, safetyZones: e.safetyZones.filter((z) => z.id !== zoneId) };
    });
    setEnvironments(updated);
    setEditingZone(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Safety Zone Editor</h2>
        <p className="text-sm text-gray-400">Configure safety boundaries for robot operation</p>
      </div>

      {/* Environment selector */}
      <div className="flex gap-3">
        {environments.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedEnv(e)}
            className={`px-4 py-2 rounded-lg text-sm border transition-all ${
              env?.id === e.id ? 'bg-sim-600/20 border-sim-600/30 text-sim-400' : 'bg-gray-900/50 border-gray-800 text-gray-400'
            }`}
          >
            {e.name}
          </button>
        ))}
      </div>

      {env && (
        <div className="grid grid-cols-3 gap-6">
          {/* Zone Map */}
          <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Safety Zone Map</h3>
              <button
                onClick={() => addZone(env.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-sim-600/20 text-sim-400 rounded-lg text-xs"
              >
                <Plus size={14} /> Add Zone
              </button>
            </div>

            <div className="relative bg-gray-800/30 rounded-lg" style={{ height: '400px' }}>
              <svg className="w-full h-full" viewBox="-6 -6 12 12">
                {/* Grid */}
                {Array.from({ length: 13 }).map((_, i) => (
                  <g key={i}>
                    <line x1={-6} y1={i - 6} x2={6} y2={i - 6} stroke="#1a2a1a" strokeWidth="0.02" />
                    <line x1={i - 6} y1={-6} x2={i - 6} y2={6} stroke="#1a2a1a" strokeWidth="0.02" />
                  </g>
                ))}

                {/* Safety zones */}
                {env.safetyZones.map((zone) => {
                  const color = zone.type === 'restricted' ? '#ff4444' : zone.type === 'caution' ? '#ffaa00' : '#44ff44';
                  return (
                    <g key={zone.id} onClick={() => setEditingZone(zone)} className="cursor-pointer">
                      <circle
                        cx={zone.center[0]} cy={zone.center[2]} r={zone.radius}
                        fill={color} fillOpacity={0.15} stroke={color} strokeWidth="0.05" strokeDasharray={zone.type === 'restricted' ? '0.2' : 'none'}
                      />
                      <text x={zone.center[0]} y={zone.center[2]} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="0.3">
                        {zone.name}
                      </text>
                    </g>
                  );
                })}

                {/* Objects */}
                {env.objects.map((obj) => (
                  <rect key={obj.id} x={obj.position[0] - obj.size[0] / 2} y={obj.position[2] - obj.size[2] / 2}
                    width={obj.size[0]} height={obj.size[2]} fill={obj.color} fillOpacity={0.5} stroke="#fff" strokeWidth="0.02" />
                ))}
              </svg>
            </div>
          </div>

          {/* Zone List & Editor */}
          <div className="space-y-4">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">Safety Zones</h3>
              <div className="space-y-2">
                {env.safetyZones.map((zone) => {
                  const config = zoneTypeConfig[zone.type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={zone.id}
                      onClick={() => setEditingZone(zone)}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                        editingZone?.id === zone.id ? config.bg : 'bg-gray-800/30 border-transparent hover:border-gray-700'
                      }`}
                    >
                      <Icon size={14} className={config.color} />
                      <span className="flex-1 text-sm">{zone.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); removeZone(env.id, zone.id); }} className="text-red-400 hover:text-red-300">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {editingZone && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-3">Edit Zone</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Name</label>
                    <input
                      type="text" value={editingZone.name}
                      onChange={(e) => { const n = e.target.value; setEditingZone({ ...editingZone, name: n }); updateZone(env.id, editingZone.id, { name: n }); }}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Type</label>
                    <select
                      value={editingZone.type}
                      onChange={(e) => {
                        const t = e.target.value as SafetyZone['type'];
                        setEditingZone({ ...editingZone, type: t });
                        updateZone(env.id, editingZone.id, { type: t });
                      }}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                    >
                      <option value="safe">Safe</option>
                      <option value="caution">Caution</option>
                      <option value="restricted">Restricted</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Radius (m)</label>
                    <input
                      type="range" min={0.5} max={5} step={0.1} value={editingZone.radius}
                      onChange={(e) => {
                        const r = parseFloat(e.target.value);
                        setEditingZone({ ...editingZone, radius: r });
                        updateZone(env.id, editingZone.id, { radius: r });
                      }}
                      className="w-full accent-sim-500"
                    />
                    <span className="text-xs text-gray-400">{editingZone.radius.toFixed(1)}m</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['X', 'Y', 'Z'].map((axis, i) => (
                      <div key={axis}>
                        <label className="text-xs text-gray-400 block mb-1">{axis}</label>
                        <input
                          type="number" step={0.1} value={editingZone.center[i]}
                          onChange={(e) => {
                            const c = [...editingZone.center] as [number, number, number];
                            c[i] = parseFloat(e.target.value) || 0;
                            setEditingZone({ ...editingZone, center: c });
                            updateZone(env.id, editingZone.id, { center: c });
                          }}
                          className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-2">Legend</h3>
              <div className="space-y-2">
                {Object.entries(zoneTypeConfig).map(([type, config]) => {
                  const Icon = config.icon;
                  return (
                    <div key={type} className="flex items-center gap-2 text-xs">
                      <Icon size={12} className={config.color} />
                      <span className={config.color + ' capitalize'}>{type}</span>
                      <span className="text-gray-600">- {type === 'restricted' ? 'No entry' : type === 'caution' ? 'Reduced speed' : 'Normal operation'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
