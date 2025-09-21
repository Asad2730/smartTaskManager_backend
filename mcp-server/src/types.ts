export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed';
  timeSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  role: 'free' | 'premium';
}

export interface MonthlySummaryRequest {
  userId: string;
  month: number;
  year: number;
}

export interface ChatQueryRequest {
  userId: string;
  query: string;
}

export interface AIResponse {
  summary: string | undefined;
  insights: string[];
  recommendations?: string[];
  data?: any;
}