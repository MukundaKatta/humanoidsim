# HumanoidSim

> 3D robot learning simulation platform with environment visualization, training dashboards, and multi-robot coordination.

## Features

- **3D Environment Viewer** -- Interactive Three.js-powered 3D visualization of simulation environments
- **Learning Dashboard** -- Real-time training metrics, reward curves, and episode tracking for RL agents
- **Task Definitions** -- Configure and manage robot tasks with customizable objectives and constraints
- **Demonstration Panel** -- Record and replay human demonstrations for imitation learning
- **Multi-Robot View** -- Monitor and coordinate multiple robots simultaneously in shared environments
- **Safety Zone Editor** -- Define and visualize safety boundaries and exclusion zones in 3D space

## Tech Stack

| Layer       | Technology                                   |
| ----------- | -------------------------------------------- |
| Framework   | Next.js 14 (App Router)                      |
| Language    | TypeScript                                   |
| 3D          | Three.js, @react-three/fiber, @react-three/drei |
| Charts      | Recharts                                     |
| UI          | Tailwind CSS, Lucide React                   |
| State       | Zustand                                      |
| Backend     | Supabase (Auth + Database)                   |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
humanoidsim/
├── app/
│   └── page.tsx                  # Main app with tab-based navigation
├── components/
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── EnvironmentViewer.tsx     # 3D environment viewer
│   ├── LearningDashboard.tsx     # Training metrics
│   ├── TaskDefinitions.tsx       # Task configuration
│   ├── DemonstrationPanel.tsx    # Demo recording/replay
│   ├── MultiRobotView.tsx        # Multi-robot coordination
│   └── SafetyZoneEditor.tsx      # Safety zone editor
├── lib/
│   ├── store.ts                  # Zustand store
│   └── mock-data.ts              # Mock simulation data
└── package.json
```

