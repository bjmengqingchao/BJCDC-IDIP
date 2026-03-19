import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart, BarChart, Bar } from 'recharts';
import { MOCK_CHART_DATA, MOCK_PEAK_DATA, MOCK_HEALTH_TIPS } from '../constants';
import { Download, Calendar, ShieldCheck, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';

interface MainChartProps {
  viewId: string;
  title: string;
  disease: string;
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

const MainChart: React.FC<MainChartProps> = ({ viewId, title, disease, isMaximized, onToggleMaximize }) => {
  const [sliderValue, setSliderValue] = useState(30);

  const filteredChartData = MOCK_CHART_DATA.slice(0, sliderValue);
  const filteredPeakData = MOCK_PEAK_DATA.filter(item => {
    const day = parseInt(item.peakDate.split('-')[1], 10);
    return day <= sliderValue;
  });

  const handleDownload = () => {
    let dataToDownload: any[] = [];
    const filename = `${disease}-${title}.csv`;
    
    if (viewId.includes('peak')) {
      dataToDownload = filteredPeakData.map(item => ({
        '区域': item.region,
        '预测峰值日期': item.peakDate,
        '预测峰值强度': item.intensity
      }));
    } else {
      dataToDownload = filteredChartData.map(item => ({
        '日期': item.date,
        '实时指数': item.index,
        '预测趋势': item.prediction
      }));
    }

    if (dataToDownload.length === 0) return;

    // Convert to CSV
    const headers = Object.keys(dataToDownload[0]);
    const csvContent = [
      headers.join(','),
      ...dataToDownload.map(row => headers.map(header => row[header as keyof typeof row]).join(','))
    ].join('\n');

    // Add BOM for Excel compatibility with UTF-8
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render logic based on viewId
  const renderContent = () => {
    if (viewId.includes('peak')) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredPeakData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="region" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
               cursor={{fill: '#f1f5f9'}}
               contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ bottom: 0 }} />
            <Bar dataKey="intensity" name="预测峰值强度" fill="#f97316" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (viewId.includes('tips')) {
      return (
        <div className="h-full overflow-y-auto pr-2 space-y-3">
          {MOCK_HEALTH_TIPS.map(tip => (
            <div key={tip.id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow flex gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                tip.level === 'high' ? 'bg-red-100 text-red-600' : 
                tip.level === 'medium' ? 'bg-orange-100 text-orange-600' : 
                'bg-blue-100 text-blue-600'
              }`}>
                {tip.level === 'high' ? <AlertTriangle size={20}/> : <ShieldCheck size={20}/>}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{tip.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{tip.content}</p>
              </div>
            </div>
          ))}
          <div className="p-4 bg-medical-50/50 border border-dashed border-medical-200 rounded-xl text-center text-xs text-medical-600">
            更多健康提示请关注市疾控中心公众号
          </div>
        </div>
      );
    }

    // Default: Index/Trend Chart
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={filteredChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(val) => val.slice(5)} 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ bottom: 0 }} iconType="circle" />
          
          <Area 
            type="monotone" 
            dataKey="index" 
            name="实时指数" 
            stroke="#0ea5e9" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorIndex)" 
            animationDuration={1500}
          />
          <Line 
            type="step" 
            dataKey="prediction" 
            name="预测趋势" 
            stroke="#f97316" 
            strokeWidth={2} 
            strokeDasharray="5 5" 
            dot={false}
            animationDuration={1500}
            animationBegin={500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={`h-full bg-white rounded-2xl shadow-sm border border-medical-100 flex flex-col relative overflow-hidden transition-all duration-300 ${isMaximized ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="p-5 flex justify-between items-center border-b border-medical-50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {disease}: {title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
             数据更新时间: {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!viewId.includes('tips') && (
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full border border-green-100 font-medium animate-pulse">
                  低风险
                </span>
             </div>
          )}
          <button 
            onClick={onToggleMaximize}
            className="p-1.5 text-slate-400 hover:text-medical-600 hover:bg-medical-50 rounded-lg transition-colors"
            title={isMaximized ? "还原" : "最大化"}
          >
            {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 relative z-0 min-h-0">
        {renderContent()}
      </div>

      {/* Footer Controls (Only for charts) */}
      {!viewId.includes('tips') && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-50 bg-slate-50/30">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar size={16} className="text-medical-500" />
              时间范围选择
            </div>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-1 text-xs text-medical-600 bg-white border border-medical-100 hover:bg-medical-50 hover:border-medical-200 px-3 py-1.5 rounded-md transition-all shadow-sm active:scale-95"
            >
              <Download size={12} />
              下载图表数据
            </button>
          </div>
          
          {/* Interactive Slider */}
          <div className="relative h-8 flex items-center group mx-2">
              <div className="absolute w-full h-1.5 bg-slate-200 rounded-full"></div>
              {/* Active Track */}
              <div 
                className="absolute h-1.5 bg-medical-400 rounded-full transition-all duration-100"
                style={{ left: '0%', width: `${(sliderValue / 30) * 100}%` }}
              ></div>
              
              {/* Left Thumb */}
              <div className="absolute left-0 w-4 h-4 bg-white border-2 border-medical-500 rounded-full shadow-md cursor-grab -translate-x-1/2 hover:scale-110 transition-transform"></div>
              
              {/* Right Thumb (Interactive) */}
              <input 
                type="range" 
                min="1" 
                max="30" 
                value={sliderValue} 
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="absolute w-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute w-4 h-4 bg-white border-2 border-medical-500 rounded-full shadow-md pointer-events-none -translate-x-1/2 transition-all duration-75 hover:scale-110"
                style={{ left: `${(sliderValue / 30) * 100}%` }}
              ></div>

               {/* Labels */}
               <div className="absolute left-0 top-6 -translate-x-1/2 text-[10px] text-slate-500 font-mono">2023-11-01</div>
               <div 
                 className="absolute top-6 -translate-x-1/2 text-[10px] text-medical-600 font-bold font-mono transition-all duration-75"
                 style={{ left: `${(sliderValue / 30) * 100}%` }}
               >
                 2023-11-{sliderValue.toString().padStart(2, '0')}
               </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainChart;