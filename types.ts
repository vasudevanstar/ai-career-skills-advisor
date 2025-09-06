import { Modality, Type } from "@google/genai";

export { Modality, Type };
export type AppPage = 'HOME' | 'PROFILE' | 'ROLE_FIT' | 'ROADMAP' | 'INTERVIEW' | 'RESUME' | 'DASHBOARD' | 'JOBS' | 'ASSESSMENTS';

export interface UserProfile {
  name: string;
  email: string;
  interests: string;
  stream: string; // Academic Stream
  language: string; // Preferred Language
  goals: string; // Career Goals
}

export interface ResourceLink {
  name: string;
  url: string;
}

export interface CareerRole {
  id: string;
  title: string;
  description: string;
  fitScore: number; // 0-100
  explanation: string;
  missingSkills: string[];
  totalSkills: string[]; // Added for match score calculation
  resources: ResourceLink[];
  relevantStreams: string[];
}

export interface RoadmapGoal {
  text: string;
  completed: boolean;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  goals: RoadmapGoal[];
  notes?: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    link: string;
}

export interface JobListing {
    id: string;
    title: string;
    company: string;
    location: string;
    experience: string; // e.g., "0-1 Years", "2+ Years", "Internship"
    requiredSkills: string[];
    link: string;
    companySize: 'Startup' | 'Mid-Size' | 'Large';
    industry: string;
    postedDate: string; // ISO Date string for sorting
    workStyle: 'On-site' | 'Remote' | 'Hybrid';
    relevantStreams: string[];
    matchScore?: number;
    matchReason?: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

export interface Assessment {
  id: string;
  title: string;
  skill: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentAttempt {
  assessmentId: string;
  score: number; // Percentage
  completedAt: string; // ISO Date string
}

export interface DashboardWidgets {
  nextGoal: boolean;
  skillsToDevelop: boolean;
  recommendedAssessment: boolean;
  activeSessions: boolean;
}

export interface User {
    uid: string;
    email: string | null;
}

// AppState Interface
export interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  activePage: AppPage;
  userProfile: UserProfile | null;
  selectedRole: CareerRole | null;
  roadmap: RoadmapWeek[];
  portfolio: Project[];
  assessmentAttempts: AssessmentAttempt[];
  interviewMessages: ChatMessage[];
  interviewSummary: { strengths: string; improvements: string; } | null;
  interviewField: string | null;
  activeAssessment: {
    id: string;
    answers: Record<string, string>;
    currentQuestionIndex: number;
  } | null;
  isLoading: { [key: string]: boolean };
  dashboardWidgets: DashboardWidgets;
}

// Action Types
export type AppAction =
  | { type: 'NAVIVATE'; payload: AppPage }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_ROLE'; payload: CareerRole }
  | { type: 'SET_ROADMAP'; payload: RoadmapWeek[] }
  | { type: 'TOGGLE_GOAL'; payload: { weekIndex: number; goalIndex: number } }
  | { type: 'UPDATE_NOTE'; payload: { weekIndex: number; note: string } }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: string } // by project id
  | { type: 'SUBMIT_ASSESSMENT'; payload: AssessmentAttempt }
  | { type: 'SET_LOADING'; payload: { key: string; value: boolean } }
  | { type: 'SET_INTERVIEW_MESSAGES', payload: ChatMessage[] }
  | { type: 'SET_INTERVIEW_SUMMARY', payload: { strengths: string; improvements: string; } }
  | { type: 'SET_INTERVIEW_FIELD'; payload: string | null }
  | { type: 'CLEAR_INTERVIEW' }
  | { type: 'START_ASSESSMENT', payload: string } // assessmentId
  | { type: 'UPDATE_ASSESSMENT_PROGRESS', payload: { answers: Record<string, string>, currentQuestionIndex: number } }
  | { type: 'CLEAR_ACTIVE_ASSESSMENT' }
  | { type: 'UPDATE_WIDGET_VISIBILITY'; payload: { widget: keyof DashboardWidgets; isVisible: boolean } };