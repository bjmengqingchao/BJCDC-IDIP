import { DiseaseType, DiseaseDataPoint, DistrictRisk, MenuItem } from './types';

export const MOCK_CHART_DATA: DiseaseDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2023, 10, i + 1);
  return {
    date: date.toISOString().split('T')[0],
    index: Math.floor(40 + Math.random() * 30 + (i * 0.5)),
    prediction: Math.floor(35 + Math.random() * 40 + (i * 0.5)),
  };
});

// Mock Data for Peak Forecast
export const MOCK_PEAK_DATA = [
  { region: '朝阳区', peakDate: '11-15', intensity: 85 },
  { region: '海淀区', peakDate: '11-18', intensity: 72 },
  { region: '丰台区', peakDate: '11-12', intensity: 65 },
  { region: '大兴区', peakDate: '11-20', intensity: 55 },
  { region: '通州区', peakDate: '11-16', intensity: 78 },
  { region: '昌平区', peakDate: '11-22', intensity: 45 },
  { region: '顺义区', peakDate: '11-19', intensity: 40 },
];

// Mock Data for Health Tips
export const MOCK_HEALTH_TIPS = [
  {
    id: 1,
    title: '加强个人防护',
    content: '近期流感高发，建议在公共场所佩戴口罩，勤洗手，保持良好的个人卫生习惯。',
    level: 'high'
  },
  {
    id: 2,
    title: '疫苗接种提醒',
    content: '建议老年人、儿童等重点人群及时接种流感疫苗和新冠疫苗，建立免疫屏障。',
    level: 'medium'
  },
  {
    id: 3,
    title: '室内通风',
    content: '保持室内空气流通，每天开窗通风至少2次，每次30分钟以上。',
    level: 'low'
  },
  {
    id: 4,
    title: '关注气温变化',
    content: '近期气温波动较大，请适时增减衣物，预防感冒。',
    level: 'medium'
  }
];

// Accurate Beijing District Data for ECharts (matching GeoJSON names)
export const BEIJING_DISTRICTS: DistrictRisk[] = [
  { id: '14', name: '延庆区', riskLevel: 'low', value: 8 },
  { id: '12', name: '怀柔区', riskLevel: 'low', value: 12 },
  { id: '13', name: '密云区', riskLevel: 'low', value: 10 },
  { id: '7', name: '昌平区', riskLevel: 'low', value: 25 },
  { id: '11', name: '顺义区', riskLevel: 'medium', value: 38 },
  { id: '15', name: '平谷区', riskLevel: 'low', value: 15 },
  { id: '16', name: '门头沟区', riskLevel: 'low', value: 12 },
  { id: '1', name: '海淀区', riskLevel: 'medium', value: 45 },
  { id: '6', name: '石景山区', riskLevel: 'low', value: 15 },
  { id: '4', name: '西城区', riskLevel: 'medium', value: 55 },
  { id: '3', name: '东城区', riskLevel: 'low', value: 20 },
  { id: '2', name: '朝阳区', riskLevel: 'high', value: 82 },
  { id: '8', name: '通州区', riskLevel: 'high', value: 75 },
  { id: '5', name: '丰台区', riskLevel: 'medium', value: 48 },
  { id: '10', name: '房山区', riskLevel: 'low', value: 10 },
  { id: '9', name: '大兴区', riskLevel: 'medium', value: 40 },
];

export const MAP_DATA_LAYERS = {
  default: BEIJING_DISTRICTS,
  places: BEIJING_DISTRICTS.map(d => ({ ...d, value: Math.floor(Math.random() * 100), riskLevel: Math.random() > 0.5 ? 'high' : 'low' })),
  institutions: BEIJING_DISTRICTS.map(d => ({ ...d, value: Math.floor(Math.random() * 100), riskLevel: Math.random() > 0.7 ? 'medium' : 'low' })),
  populations: BEIJING_DISTRICTS.map(d => ({ ...d, value: Math.floor(Math.random() * 100), riskLevel: Math.random() > 0.3 ? 'high' : 'medium' }))
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'covid',
    label: '新型冠状病毒肺炎',
    type: 'category',
    children: [
      { id: 'covid-index', label: '综合防控指数', type: 'action', isActive: true },
      { id: 'covid-peak', label: '峰值预报', type: 'action' },
      { id: 'covid-tips', label: '健康提示', type: 'action' },
    ]
  },
  {
    id: 'flu',
    label: '流行性感冒',
    type: 'category',
    children: [
      { id: 'flu-index', label: '流感指数', type: 'action' },
      { id: 'flu-map', label: '传播地图', type: 'action' },
    ]
  },
  {
    id: 'hfmd',
    label: '手足口病',
    type: 'category',
    children: [
        { id: 'hfmd-trend', label: '发病趋势', type: 'action' }
    ]
  },
  {
    id: 'noro',
    label: '诺如病毒',
    type: 'category',
    children: [
        { id: 'noro-alert', label: '预警信息', type: 'action' }
    ]
  }
];