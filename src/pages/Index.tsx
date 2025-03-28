
import React, { useState } from 'react';
import { FloatProvider } from '@/context/FloatContext';
import FloatHeader from '@/components/float/FloatHeader';
import DashboardView from '@/components/float/DashboardView';
import IdentityManager from '@/components/float/IdentityManager';
import FileStorage from '@/components/float/FileStorage';
import RitualManager from '@/components/float/RitualManager';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'identity' | 'files' | 'rituals'>('dashboard');

  return (
    <FloatProvider>
      <div className="min-h-screen bg-float-background text-white flex flex-col">
        <FloatHeader setCurrentView={setCurrentView} currentView={currentView} />
        
        <main className="flex-1">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'identity' && <div className="p-6"><IdentityManager /></div>}
          {currentView === 'files' && <div className="p-6"><FileStorage /></div>}
          {currentView === 'rituals' && <div className="p-6"><RitualManager /></div>}
        </main>
      </div>
    </FloatProvider>
  );
};

export default Index;
