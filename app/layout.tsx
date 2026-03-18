import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HumanoidSim - Robot Learning Simulation',
  description: 'Robot learning simulation with 3D environments, RL dashboard, and multi-robot scenarios',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0f0a] text-gray-100 antialiased">{children}</body>
    </html>
  );
}
