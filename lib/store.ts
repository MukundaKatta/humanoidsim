import { create } from 'zustand';

export interface Environment {
  id: string;
  name: string;
  description: string;
  type: 'indoor' | 'outdoor' | 'warehouse' | 'lab' | 'kitchen';
  objects: SimObject[];
  safetyZones: SafetyZone[];
}

export interface SimObject {
  id: string;
  name: string;
  type: 'obstacle' | 'target' | 'tool' | 'furniture';
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

export interface SafetyZone {
  id: string;
  name: string;
  type: 'restricted' | 'caution' | 'safe';
  center: [number, number, number];
  radius: number;
}

export interface SimRobot {
  id: string;
  name: string;
  model: string;
  position: [number, number, number];
  rotation: [number, number, number];
  status: 'idle' | 'learning' | 'executing' | 'error';
  taskId: string | null;
}

export interface TaskDefinition {
  id: string;
  name: string;
  description: string;
  type: 'navigation' | 'manipulation' | 'interaction' | 'assembly';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  steps: string[];
  successCriteria: string;
  maxTime: number;
  reward: number;
}

export interface Demonstration {
  id: string;
  taskId: string;
  robotId: string;
  frames: DemoFrame[];
  duration: number;
  quality: number;
  created_at: string;
}

export interface DemoFrame {
  timestamp: number;
  position: [number, number, number];
  joints: Record<string, number>;
  gripper: number;
}

export interface TrainingRun {
  id: string;
  taskId: string;
  algorithm: 'PPO' | 'SAC' | 'DDPG' | 'TD3' | 'DQN';
  episodes: number;
  maxEpisodes: number;
  reward: number;
  successRate: number;
  status: 'running' | 'completed' | 'failed' | 'paused';
  history: { episode: number; reward: number; successRate: number }[];
  created_at: string;
}

interface HumanoidSimState {
  environments: Environment[];
  robots: SimRobot[];
  tasks: TaskDefinition[];
  demonstrations: Demonstration[];
  trainingRuns: TrainingRun[];
  activeTab: string;
  selectedEnv: Environment | null;
  selectedRobot: SimRobot | null;
  setActiveTab: (tab: string) => void;
  setSelectedEnv: (env: Environment | null) => void;
  setSelectedRobot: (robot: SimRobot | null) => void;
  setEnvironments: (envs: Environment[]) => void;
  setRobots: (robots: SimRobot[]) => void;
  setTasks: (tasks: TaskDefinition[]) => void;
  addDemonstration: (demo: Demonstration) => void;
  addTrainingRun: (run: TrainingRun) => void;
  updateTrainingRun: (id: string, updates: Partial<TrainingRun>) => void;
}

export const useStore = create<HumanoidSimState>((set) => ({
  environments: [],
  robots: [],
  tasks: [],
  demonstrations: [],
  trainingRuns: [],
  activeTab: 'environments',
  selectedEnv: null,
  selectedRobot: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedEnv: (env) => set({ selectedEnv: env }),
  setSelectedRobot: (robot) => set({ selectedRobot: robot }),
  setEnvironments: (environments) => set({ environments }),
  setRobots: (robots) => set({ robots }),
  setTasks: (tasks) => set({ tasks }),
  addDemonstration: (demo) => set((s) => ({ demonstrations: [...s.demonstrations, demo] })),
  addTrainingRun: (run) => set((s) => ({ trainingRuns: [...s.trainingRuns, run] })),
  updateTrainingRun: (id, updates) =>
    set((s) => ({
      trainingRuns: s.trainingRuns.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
}));
