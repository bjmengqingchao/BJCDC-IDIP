import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainChart from './components/MainChart';
import RiskMap from './components/RiskMap';
import { Bell } from 'lucide-react';
import { MenuItem } from './types';

export default function App() {
  const [currentViewId, setCurrentViewId] = useState('covid-index');
  const [currentDisease, setCurrentDisease] = useState('新型冠状病毒肺炎');
  const [currentViewTitle, setCurrentViewTitle] = useState('综合防控指数');
  
  // State for tracking which panel is maximized: 'none', 'chart', 'map'
  const [maximizedPanel, setMaximizedPanel] = useState<'none' | 'chart' | 'map'>('none');

  const handleMenuSelect = (item: MenuItem) => {
    // Determine disease context based on ID prefix or logic
    let disease = currentDisease;
    if (item.id.startsWith('covid')) disease = '新型冠状病毒肺炎';
    else if (item.id.startsWith('flu')) disease = '流行性感冒';
    else if (item.id.startsWith('hfmd')) disease = '手足口病';
    else if (item.id.startsWith('noro')) disease = '诺如病毒';

    setCurrentDisease(disease);
    setCurrentViewId(item.id);
    setCurrentViewTitle(item.label);
  };

  const toggleMaximize = (panel: 'chart' | 'map') => {
    if (maximizedPanel === panel) {
      setMaximizedPanel('none');
    } else {
      setMaximizedPanel(panel);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-[1920px] mx-auto bg-medical-50">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-medical-100 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-medical-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-medical-200">
             <span className="text-white font-bold text-lg">CDC</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-medical-700 to-indigo-700">
              传染病传播风险指数平台
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">INFECTIOUS DISEASE RISK INDEX PLATFORM</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="h-6 w-px bg-slate-200"></div>

            <button className="relative p-2 text-slate-500 hover:text-medical-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-2 pl-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                    <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs text-slate-600 hidden md:block">
                    <p className="font-semibold">管理员</p>
                    <p className="text-slate-400">疾控中心</p>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden relative">
        {maximizedPanel !== 'none' && (
           <div 
             className="absolute inset-0 bg-black/50 z-30 backdrop-blur-sm"
             onClick={() => setMaximizedPanel('none')} 
           />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
          {/* Left Column - Navigation (20%) - Hidden when any panel maximized */}
          <div className={`md:col-span-3 lg:col-span-2 h-full min-h-[400px] transition-all duration-300 ${maximizedPanel !== 'none' ? 'opacity-0 pointer-events-none absolute' : ''}`}>
            <Sidebar onSelect={handleMenuSelect} />
          </div>

          {/* Middle Column - Chart/Content (45%) */}
          <div className={`transition-all duration-300 h-full min-h-[400px] ${
            maximizedPanel === 'chart' 
              ? 'md:col-span-12 z-40' 
              : maximizedPanel === 'map' 
                ? 'opacity-0 pointer-events-none absolute' 
                : 'md:col-span-5 lg:col-span-6'
          }`}>
             <MainChart 
               viewId={currentViewId} 
               title={currentViewTitle} 
               disease={currentDisease}
               isMaximized={maximizedPanel === 'chart'}
               onToggleMaximize={() => toggleMaximize('chart')}
             />
          </div>

          {/* Right Column - Map (35%) */}
          <div className={`transition-all duration-300 h-full min-h-[400px] ${
             maximizedPanel === 'map' 
               ? 'md:col-span-12 z-40' 
               : maximizedPanel === 'chart' 
                 ? 'opacity-0 pointer-events-none absolute' 
                 : 'md:col-span-4 lg:col-span-4'
          }`}>
            <RiskMap 
              disease={currentDisease}
              isMaximized={maximizedPanel === 'map'}
              onToggleMaximize={() => toggleMaximize('map')} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}