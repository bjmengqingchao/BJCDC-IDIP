import React, { useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { ChevronDown, ChevronRight, Activity, AlertTriangle, Thermometer, ShieldAlert } from 'lucide-react';
import { MenuItem } from '../types';

interface SidebarProps {
  onSelect: (item: MenuItem) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'covid': true,
    'flu': true,
    'hfmd': true,
    'noro': true
  });
  const [activeId, setActiveId] = useState<string>('covid-index');

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleItemClick = (item: MenuItem) => {
    setActiveId(item.id);
    onSelect(item);
  };

  const getIcon = (id: string) => {
    if (id === 'covid') return <Activity size={18} />;
    if (id === 'flu') return <Thermometer size={18} />;
    if (id === 'hfmd') return <ShieldAlert size={18} />;
    return <AlertTriangle size={18} />;
  };

  return (
    <div className="h-full bg-white rounded-2xl shadow-sm border border-medical-100 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-medical-50 bg-gradient-to-r from-medical-50 to-white">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-medical-500 rounded-full"></div>
          重点传染病
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {MENU_ITEMS.map((category) => (
          <div key={category.id} className="rounded-lg overflow-hidden">
            <button 
              onClick={() => toggleExpand(category.id)}
              className={`w-full flex items-center justify-between p-3 text-sm font-medium transition-colors ${
                expanded[category.id] ? 'bg-medical-50 text-medical-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                {getIcon(category.id)}
                <span>{category.label}</span>
              </div>
              {expanded[category.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {expanded[category.id] && category.children && (
              <div className="bg-medical-50/30 py-1 transition-all duration-300 ease-in-out">
                {category.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleItemClick(child)}
                    className={`w-full text-left pl-11 pr-4 py-2 text-sm transition-all border-l-4 ${
                      activeId === child.id 
                        ? 'border-medical-500 bg-medical-100/50 text-medical-800 font-semibold shadow-inner' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-medical-50'
                    }`}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;