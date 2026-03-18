'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useStore, Environment, SimObject, SafetyZone } from '@/lib/store';
import { Box, Eye, Settings, Plus } from 'lucide-react';
import * as THREE from 'three';

function EnvironmentObject({ obj }: { obj: SimObject }) {
  return (
    <mesh position={obj.position}>
      <boxGeometry args={obj.size} />
      <meshStandardMaterial color={obj.color} transparent opacity={0.85} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...obj.size)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </lineSegments>
    </mesh>
  );
}

function SafetyZoneViz({ zone }: { zone: SafetyZone }) {
  const color = zone.type === 'restricted' ? '#ff4444' : zone.type === 'caution' ? '#ffaa00' : '#44ff44';
  return (
    <mesh position={zone.center} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[zone.radius - 0.05, zone.radius, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

function SimRobotModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]}>
        <capsuleGeometry args={[0.15, 0.5, 8, 16]} />
        <meshStandardMaterial color="#4caf50" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#66bb6a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, 0.08]}>
        <boxGeometry args={[0.18, 0.05, 0.05]} />
        <meshStandardMaterial color="#00e676" emissive="#00e676" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function Scene({ env, showSafety }: { env: Environment; showSafety: boolean }) {
  const { robots } = useStore();
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
      <pointLight position={[-3, 4, -3]} intensity={0.3} color="#4caf50" />
      {env.objects.map((obj) => <EnvironmentObject key={obj.id} obj={obj} />)}
      {showSafety && env.safetyZones.map((zone) => <SafetyZoneViz key={zone.id} zone={zone} />)}
      {robots.map((robot) => <SimRobotModel key={robot.id} position={robot.position} />)}
      <Grid position={[0, -0.01, 0]} args={[20, 20]} cellSize={0.5} cellColor="#0a2f0a" sectionSize={2} sectionColor="#1a4f1a" fadeDistance={15} />
      <OrbitControls makeDefault />
    </>
  );
}

export default function EnvironmentViewer() {
  const { environments, selectedEnv, setSelectedEnv } = useStore();
  const [showSafety, setShowSafety] = useState(true);
  const env = selectedEnv || environments[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">3D Environments</h2>
          <p className="text-sm text-gray-400">Simulation environments for robot learning</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSafety(!showSafety)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border ${
              showSafety ? 'bg-sim-600/20 border-sim-600/30 text-sim-400' : 'bg-gray-900/50 border-gray-800 text-gray-400'
            }`}
          >
            <Eye size={14} /> Safety Zones
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Env list */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Environments</h3>
          {environments.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedEnv(e)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                env?.id === e.id ? 'bg-sim-600/20 border-sim-600/30 text-sim-400' : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Box size={14} />
                <span className="font-medium text-sm">{e.name}</span>
              </div>
              <p className="text-xs text-gray-500">{e.description}</p>
              <div className="flex gap-2 mt-2 text-xs text-gray-600">
                <span>{e.objects.length} objects</span>
                <span>{e.safetyZones.length} zones</span>
              </div>
            </button>
          ))}
        </div>

        {/* 3D View */}
        <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden" style={{ height: '500px' }}>
          {env ? (
            <Canvas camera={{ position: [5, 4, 5], fov: 50 }}>
              <Scene env={env} showSafety={showSafety} />
            </Canvas>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Select an environment</div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          {env && (
            <>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-3">Objects</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                  {env.objects.map((obj) => (
                    <div key={obj.id} className="flex items-center gap-2 text-xs bg-gray-800/30 rounded-lg p-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: obj.color }} />
                      <span className="flex-1">{obj.name}</span>
                      <span className="text-gray-500 capitalize">{obj.type}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-3">Safety Zones</h3>
                <div className="space-y-2">
                  {env.safetyZones.map((zone) => (
                    <div key={zone.id} className={`text-xs p-2 rounded-lg border ${
                      zone.type === 'restricted' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                      zone.type === 'caution' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                      'bg-green-500/10 border-green-500/20 text-green-400'
                    }`}>
                      <span className="font-medium">{zone.name}</span>
                      <span className="ml-2 text-gray-500">r={zone.radius}m</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-3">Properties</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="capitalize">{env.type}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Objects</span><span>{env.objects.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Safety Zones</span><span>{env.safetyZones.length}</span></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
