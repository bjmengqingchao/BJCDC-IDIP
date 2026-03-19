import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { BEIJING_DISTRICTS, MAP_DATA_LAYERS } from '../constants';
import { MapPin, Building2, Users, Maximize2, Minimize2, Download } from 'lucide-react';
import beijingGeoJson from '../北京市.json';

interface RiskMapProps {
  disease: string;
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

type MapLayerType = 'default' | 'places' | 'institutions' | 'populations';

const RiskMap: React.FC<RiskMapProps> = ({ disease, isMaximized, onToggleMaximize }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('default');

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize Chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const loadData = () => {
      try {
        setLoading(true);
        echarts.registerMap('beijing', beijingGeoJson as any);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load map data", error);
        setLoading(false);
      }
    };

    loadData();

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  // Update chart when disease, loading, or activeLayer changes
  useEffect(() => {
    if (!loading && chartInstance.current) {
      updateChart();
    }
  }, [disease, loading, activeLayer]);

  // Resize when maximize state changes
  useEffect(() => {
    if (chartInstance.current) {
      setTimeout(() => {
        chartInstance.current?.resize();
      }, 100); // Small delay to allow transition to finish
    }
  }, [isMaximized]);

  const updateChart = () => {
    if (!chartInstance.current) return;

    const data = MAP_DATA_LAYERS[activeLayer] as any[];

    // Define visual pieces based on layer
    let visualPieces = [
      { min: 70, label: '高风险', color: '#ef4444' }, // Red
      { min: 40, max: 70, label: '中风险', color: '#f97316' }, // Orange
      { max: 40, label: '低风险', color: '#60a5fa' } // Blue
    ];

    if (activeLayer !== 'default') {
         // Slightly different colors for different layers to indicate change
         if (activeLayer === 'places') {
            visualPieces = [
              { min: 70, label: '高密集', color: '#7c3aed' }, 
              { min: 40, max: 70, label: '中密集', color: '#a78bfa' }, 
              { max: 40, label: '低密集', color: '#c4b5fd' } 
            ];
         } else if (activeLayer === 'institutions') {
             visualPieces = [
              { min: 70, label: '高关注', color: '#059669' }, 
              { min: 40, max: 70, label: '中关注', color: '#34d399' }, 
              { max: 40, label: '低关注', color: '#6ee7b7' } 
            ];
         }
    }

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (!params.data) return '';
          return `
            <div style="font-family: sans-serif; padding: 4px;">
              <div style="font-weight: bold; color: #1e293b;">${params.name}</div>
              <div style="display: flex; align-items: center; gap: 4px; margin-top: 4px;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${params.color}"></span>
                <span style="font-size: 12px; color: #475569;">
                   数值: ${params.value}
                </span>
              </div>
            </div>
          `;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        textStyle: {
          color: '#334155'
        },
        padding: 8
      },
      visualMap: {
        min: 0,
        max: 100,
        left: 'left',
        bottom: 'bottom',
        text: activeLayer === 'places' ? ['密集', '稀疏'] : ['高风险', '低风险'],
        calculable: true,
        pieces: visualPieces,
        show: false 
      },
      series: [
        {
          name: '北京',
          type: 'map',
          map: 'beijing',
          roam: true, 
          zoom: 1.1,
          label: {
            show: true,
            color: '#334155',
            fontSize: 10,
            formatter: '{b}' 
          },
          itemStyle: {
            areaColor: '#f1f5f9',
            borderColor: '#ffffff',
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              areaColor: '#e2e8f0',
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            },
            label: {
              color: '#0f172a',
              fontWeight: 'bold'
            }
          },
          select: {
            itemStyle: {
               areaColor: '#cbd5e1'
            }
          },
          data: data.map(d => ({
            name: d.name,
            value: d.value,
            riskLevel: d.riskLevel
          }))
        }
      ]
    };

    chartInstance.current.setOption(option);
  };

  const getLayerName = () => {
      switch(activeLayer) {
          case 'places': return '重点场所监测';
          case 'institutions': return '重点机构监测';
          case 'populations': return '重点人群监测';
          default: return `${disease}预报地区`;
      }
  };

  const handleDownload = () => {
    const data = MAP_DATA_LAYERS[activeLayer] as any[];
    if (!data || data.length === 0) return;

    const dataToDownload = data.map(item => ({
      '区域': item.name,
      '风险等级': item.riskLevel === 'high' ? '高' : item.riskLevel === 'medium' ? '中' : '低',
      '风险指数': item.value
    }));

    const filename = `${disease}-${getLayerName()}-地图数据.csv`;
    const headers = Object.keys(dataToDownload[0]);
    const csvContent = [
      headers.join(','),
      ...dataToDownload.map(row => headers.map(header => row[header as keyof typeof row]).join(','))
    ].join('\n');

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

  return (
    <div className={`h-full bg-white rounded-2xl shadow-sm border border-medical-100 flex flex-col relative transition-all duration-300 ${isMaximized ? 'fixed inset-4 z-50' : ''}`}>
      <div className="p-5 border-b border-medical-50 flex justify-between items-center">
        <div>
            <h2 className="text-lg font-bold text-slate-800">{getLayerName()} (北京市)</h2>
            <div className="flex gap-4 mt-2 text-xs">
                {activeLayer === 'places' ? (
                    <>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-violet-600"></span>高密集</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-violet-400"></span>中密集</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-violet-300"></span>低密集</div>
                    </>
                ) : activeLayer === 'institutions' ? (
                    <>
                         <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-600"></span>高关注</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-400"></span>中关注</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-300"></span>低关注</div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500"></span>高风险</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-orange-400"></span>中风险</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-400"></span>低风险</div>
                    </>
                )}
            </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-1 text-xs text-medical-600 bg-white border border-medical-100 hover:bg-medical-50 hover:border-medical-200 px-3 py-1.5 rounded-md transition-all shadow-sm active:scale-95"
          >
            <Download size={12} />
            下载数据
          </button>
          <button 
              onClick={onToggleMaximize}
              className="p-1.5 text-slate-400 hover:text-medical-600 hover:bg-medical-50 rounded-lg transition-colors"
              title={isMaximized ? "还原" : "最大化"}
            >
              {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-medical-50/20 overflow-hidden">
        {loading && (
           <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-500 mr-2"></div>
             加载地图数据...
           </div>
        )}
        <div ref={chartRef} className="w-full h-full" />
      </div>

      {/* Bottom Action Buttons */}
      <div className="p-5 grid grid-cols-3 gap-3 bg-white border-t border-medical-50">
        <button 
            onClick={() => setActiveLayer(activeLayer === 'places' ? 'default' : 'places')}
            className={`flex flex-col items-center justify-center gap-1 p-3 border rounded-xl shadow-sm transition-all group ${activeLayer === 'places' ? 'bg-medical-50 border-medical-500 ring-1 ring-medical-500' : 'bg-white border-slate-100 hover:shadow-md hover:border-medical-300'}`}
        >
            <div className={`p-2 rounded-full transition-colors ${activeLayer === 'places' ? 'bg-white' : 'bg-slate-50 group-hover:bg-medical-50'}`}>
                 <Building2 size={18} className={activeLayer === 'places' ? 'text-medical-600' : 'text-slate-600 group-hover:text-medical-600'}/>
            </div>
            <span className={`text-xs font-semibold ${activeLayer === 'places' ? 'text-medical-800' : 'text-slate-700'}`}>重点场所</span>
        </button>
        <button 
            onClick={() => setActiveLayer(activeLayer === 'institutions' ? 'default' : 'institutions')}
            className={`flex flex-col items-center justify-center gap-1 p-3 border rounded-xl shadow-sm transition-all group ${activeLayer === 'institutions' ? 'bg-medical-50 border-medical-500 ring-1 ring-medical-500' : 'bg-white border-slate-100 hover:shadow-md hover:border-medical-300'}`}
        >
            <div className={`p-2 rounded-full transition-colors ${activeLayer === 'institutions' ? 'bg-white' : 'bg-slate-50 group-hover:bg-medical-50'}`}>
                <MapPin size={18} className={activeLayer === 'institutions' ? 'text-medical-600' : 'text-slate-600 group-hover:text-medical-600'}/>
            </div>
            <span className={`text-xs font-semibold ${activeLayer === 'institutions' ? 'text-medical-800' : 'text-slate-700'}`}>重点机构</span>
        </button>
        <button 
            onClick={() => setActiveLayer(activeLayer === 'populations' ? 'default' : 'populations')}
            className={`flex flex-col items-center justify-center gap-1 p-3 border rounded-xl shadow-sm transition-all group ${activeLayer === 'populations' ? 'bg-medical-50 border-medical-500 ring-1 ring-medical-500' : 'bg-white border-slate-100 hover:shadow-md hover:border-medical-300'}`}
        >
             <div className={`p-2 rounded-full transition-colors ${activeLayer === 'populations' ? 'bg-white' : 'bg-slate-50 group-hover:bg-medical-50'}`}>
                <Users size={18} className={activeLayer === 'populations' ? 'text-medical-600' : 'text-slate-600 group-hover:text-medical-600'}/>
             </div>
            <span className={`text-xs font-semibold ${activeLayer === 'populations' ? 'text-medical-800' : 'text-slate-700'}`}>重点人群</span>
        </button>
      </div>
    </div>
  );
};

export default RiskMap;