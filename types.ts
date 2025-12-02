export enum DiseaseType {
  COVID = 'COVID-19',
  INFLUENZA = 'Influenza',
  HFMD = 'HFMD', // Hand, Foot, and Mouth Disease
  NOROVIRUS = 'Norovirus'
}

export interface DiseaseDataPoint {
  date: string;
  index: number;
  prediction: number;
}

export interface DistrictRisk {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  value: number;
}

export interface MenuItem {
  id: string;
  label: string;
  type: 'category' | 'action';
  children?: MenuItem[];
  isActive?: boolean;
}