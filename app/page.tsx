'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { mockEnvironments, mockRobots, mockTasks, mockTrainingRuns, mockDemonstrations } from '@/lib/mock-data';
import Sidebar from '@/components/Sidebar';
import EnvironmentViewer from '@/components/EnvironmentViewer';
import LearningDashboard from '@/components/LearningDashboard';
import TaskDefinitions from '@/components/TaskDefinitions';
import DemonstrationPanel from '@/components/DemonstrationPanel';
import MultiRobotView from '@/components/MultiRobotView';
import SafetyZoneEditor from '@/components/SafetyZoneEditor';

export default function HomePage() {
  const { activeTab, setEnvironments, setRobots, setTasks } = useStore();

  useEffect(() => {
    setEnvironments(mockEnvironments);
    setRobots(mockRobots);
    setTasks(mockTasks);
    useStore.setState({ trainingRuns: mockTrainingRuns, demonstrations: mockDemonstrations });
  }, [setEnvironments, setRobots, setTasks]);

  const renderContent = () => {
    switch (activeTab) {
      case 'environments': return <EnvironmentViewer />;
      case 'learning': return <LearningDashboard />;
      case 'tasks': return <TaskDefinitions />;
      case 'demonstrations': return <DemonstrationPanel />;
      case 'multi-robot': return <MultiRobotView />;
      case 'safety': return <SafetyZoneEditor />;
      default: return <EnvironmentViewer />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sim-400 to-sim-600 bg-clip-text text-transparent">HumanoidSim</h1>
          <p className="text-gray-400 mt-1">Robot Learning Simulation Platform</p>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
