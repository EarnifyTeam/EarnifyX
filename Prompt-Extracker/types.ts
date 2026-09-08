
export enum AppStep {
  UPLOAD = 'UPLOAD',
  PREPARING = 'PREPARING', 
  READY_TO_GENERATE = 'READY_TO_GENERATE', 
  ANALYZING = 'ANALYZING', 
  RESULT = 'RESULT',
}

export interface ImageMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  base64Data?: string;
  objectUrl?: string;
}

export interface BreakdownResult {
  imageId: string;
  title: string;
  prompt: string;
}

export interface UserState {
  isRegistered: boolean;
  email: string | null;
  name: string | null;
  promptsUsed: number;
  maxFreePrompts: number;
}

export interface ProcessingState {
  progress: number;
  message: string;
  currentCount: number;
  totalCount: number;
}
