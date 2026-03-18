import { Environment, SimRobot, TaskDefinition, TrainingRun, Demonstration } from './store';

export const mockEnvironments: Environment[] = [
  {
    id: 'env1', name: 'Lab Environment', description: 'Standard robotics lab with workbenches', type: 'lab',
    objects: [
      { id: 'o1', name: 'Workbench', type: 'furniture', position: [2, 0.5, 0], size: [2, 1, 0.8], color: '#8B4513' },
      { id: 'o2', name: 'Tool Rack', type: 'tool', position: [-2, 1, -2], size: [0.5, 2, 0.3], color: '#708090' },
      { id: 'o3', name: 'Target Box', type: 'target', position: [1, 0.3, 1], size: [0.3, 0.3, 0.3], color: '#ff6b6b' },
      { id: 'o4', name: 'Obstacle Cone', type: 'obstacle', position: [0, 0.3, 2], size: [0.3, 0.6, 0.3], color: '#ffa500' },
    ],
    safetyZones: [
      { id: 'sz1', name: 'Robot Operating Area', type: 'safe', center: [0, 0, 0], radius: 3 },
      { id: 'sz2', name: 'Human Workspace', type: 'restricted', center: [-3, 0, 0], radius: 1.5 },
    ],
  },
  {
    id: 'env2', name: 'Warehouse Floor', description: 'Large warehouse with shelving units', type: 'warehouse',
    objects: [
      { id: 'o5', name: 'Shelf Unit A', type: 'furniture', position: [3, 1.5, 0], size: [0.5, 3, 4], color: '#4a4a4a' },
      { id: 'o6', name: 'Shelf Unit B', type: 'furniture', position: [-3, 1.5, 0], size: [0.5, 3, 4], color: '#4a4a4a' },
      { id: 'o7', name: 'Package', type: 'target', position: [0, 0.2, 1], size: [0.4, 0.4, 0.4], color: '#d4a373' },
    ],
    safetyZones: [
      { id: 'sz3', name: 'Aisle', type: 'safe', center: [0, 0, 0], radius: 2 },
      { id: 'sz4', name: 'Loading Dock', type: 'caution', center: [0, 0, 5], radius: 2 },
    ],
  },
  {
    id: 'env3', name: 'Kitchen Setup', description: 'Kitchen environment for household tasks', type: 'kitchen',
    objects: [
      { id: 'o8', name: 'Counter', type: 'furniture', position: [0, 0.5, -2], size: [3, 1, 0.6], color: '#d4d4d4' },
      { id: 'o9', name: 'Cup', type: 'target', position: [0.5, 1.1, -2], size: [0.08, 0.12, 0.08], color: '#fff' },
      { id: 'o10', name: 'Stove', type: 'obstacle', position: [-1, 0.5, -2], size: [0.6, 1, 0.6], color: '#333' },
    ],
    safetyZones: [
      { id: 'sz5', name: 'Safe Zone', type: 'safe', center: [0, 0, 0], radius: 2.5 },
      { id: 'sz6', name: 'Hot Zone', type: 'restricted', center: [-1, 0, -2], radius: 0.8 },
    ],
  },
];

export const mockRobots: SimRobot[] = [
  { id: 'sr1', name: 'Learner-1', model: 'Humanoid v3', position: [0, 0, 0], rotation: [0, 0, 0], status: 'idle', taskId: null },
  { id: 'sr2', name: 'Learner-2', model: 'Humanoid v3', position: [2, 0, 2], rotation: [0, 45, 0], status: 'learning', taskId: 'task1' },
  { id: 'sr3', name: 'Explorer-1', model: 'Humanoid v4', position: [-1, 0, 1], rotation: [0, -30, 0], status: 'executing', taskId: 'task2' },
];

export const mockTasks: TaskDefinition[] = [
  { id: 'task1', name: 'Pick and Place', description: 'Pick up an object from table and place in target zone', type: 'manipulation', difficulty: 'easy', steps: ['Approach object', 'Grasp object', 'Lift object', 'Navigate to target', 'Place object'], successCriteria: 'Object placed within 5cm of target', maxTime: 30, reward: 100 },
  { id: 'task2', name: 'Navigate Obstacle Course', description: 'Navigate through a series of obstacles to reach goal', type: 'navigation', difficulty: 'medium', steps: ['Identify path', 'Avoid obstacles', 'Maintain balance', 'Reach goal'], successCriteria: 'Robot reaches goal without collision', maxTime: 60, reward: 150 },
  { id: 'task3', name: 'Door Opening', description: 'Approach a door, grasp handle, and open it', type: 'manipulation', difficulty: 'hard', steps: ['Approach door', 'Identify handle', 'Grasp handle', 'Turn handle', 'Push/pull door'], successCriteria: 'Door opened >45 degrees', maxTime: 45, reward: 200 },
  { id: 'task4', name: 'Collaborative Assembly', description: 'Work with another robot to assemble parts', type: 'assembly', difficulty: 'expert', steps: ['Coordinate positions', 'Identify parts', 'Hold base piece', 'Attach component', 'Verify assembly'], successCriteria: 'Assembly completed correctly', maxTime: 120, reward: 500 },
];

function genHistory(episodes: number): { episode: number; reward: number; successRate: number }[] {
  const h = [];
  for (let i = 0; i <= episodes; i += Math.ceil(episodes / 20)) {
    const progress = i / episodes;
    h.push({
      episode: i,
      reward: -100 + progress * 250 + (Math.random() - 0.5) * 30,
      successRate: Math.min(100, progress * 85 + (Math.random() - 0.5) * 10),
    });
  }
  return h;
}

export const mockTrainingRuns: TrainingRun[] = [
  { id: 'tr1', taskId: 'task1', algorithm: 'PPO', episodes: 800, maxEpisodes: 1000, reward: 142, successRate: 78, status: 'running', history: genHistory(800), created_at: '2024-04-01T10:00:00Z' },
  { id: 'tr2', taskId: 'task2', algorithm: 'SAC', episodes: 1000, maxEpisodes: 1000, reward: 195, successRate: 92, status: 'completed', history: genHistory(1000), created_at: '2024-03-28T10:00:00Z' },
  { id: 'tr3', taskId: 'task3', algorithm: 'TD3', episodes: 300, maxEpisodes: 2000, reward: 45, successRate: 23, status: 'running', history: genHistory(300), created_at: '2024-04-01T14:00:00Z' },
];

export const mockDemonstrations: Demonstration[] = [
  {
    id: 'd1', taskId: 'task1', robotId: 'sr1', duration: 12.5, quality: 0.92, created_at: '2024-04-01T09:00:00Z',
    frames: Array.from({ length: 25 }, (_, i) => ({
      timestamp: i * 0.5,
      position: [Math.sin(i * 0.2) * 0.5, 0, i * 0.1] as [number, number, number],
      joints: { shoulder_l: i * 3, shoulder_r: -i * 2, elbow_l: i * 4, elbow_r: -i * 3 },
      gripper: i > 15 ? 1 : 0,
    })),
  },
];
