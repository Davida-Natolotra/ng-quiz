// Checklist base
export interface ChecklistBase {
  id: string;
  ou_level: number;
  department: string;
  health_area: string;
  sections: Section[];
}

// Section
export interface Section {
  id: string;
  title: string;
  maxScore: number;
  score?: number;
  type: 'standard' | 'dq';
  contents: (StdQuestion | DQQuestion | Label)[];
}

// Base content interface
interface BaseContent {
  id: string;
  type: string;
}

// Standard Question
export interface StdQuestion extends BaseContent {
  type: 'question';
  subject: string;
  score: number;
  response?: 'Oui' | 'Non' | 'NA';
  observation: string;
  parentId?: string;
}

// Label type
export interface Label extends BaseContent {
  type: 'label';
  name: string;
  level: number;
}

// Data quality question
export interface DQQuestion extends BaseContent {
  ind_mois: IndMois[];
  lqas: LM[];
  score?: number;
}

export interface LM {
  id: string;
  mois: string;
  total: number;
}

export interface IndMois {
  id: string;
  indicator_name: string;
  dataMonths: DataMonth[];
}

export interface DataMonth {
  id: string;
  mois: string;
  base_name: string;
  base_data: number;
  recount_source: string;
  recount_data: number;
  rate: number;
  concordance: boolean;
}
