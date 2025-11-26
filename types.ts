export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface SummaryItem {
  timestamp: string;
  content: string;
}

export interface AnalysisResult {
  title: string;
  summary: string; // General overview
  points: SummaryItem[]; // Timestamped points
}
