import React, { Dispatch, ReactNode, createContext, useContext, useEffect, useReducer } from 'react';
import { AppAction, AppState, User } from '../types';

// Initial State
const initialState: AppState = {
  user: null, // No user initially
  theme: 'light', // Default theme
  activePage: 'HOME',
  userProfile: null,
  selectedRole: null,
  roadmap: [],
  portfolio: [],
  assessmentAttempts: [],
  interviewMessages: [],
  interviewSummary: null,
  interviewField: null,
  activeAssessment: null,
  isLoading: {},
  dashboardWidgets: {
    nextGoal: true,
    skillsToDevelop: true,
    recommendedAssessment: true,
    activeSessions: true,
  },
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'NAVIVATE':
      return { ...state, activePage: action.payload };
    case 'LOGIN_SUCCESS':
      const isNewUser = !state.userProfile?.name;
      return { 
          ...state, 
          user: action.payload,
          activePage: isNewUser ? 'PROFILE' : 'DASHBOARD'
      };
    case 'LOGOUT':
        // Reset all user-specific data to initial state, but keep theme
        const theme = state.theme;
        const freshState = { ...initialState, theme };
        // Since we are logging out, we clear the persisted state for the next user.
        localStorage.removeItem('appState');
        return freshState;
    case 'TOGGLE_THEME':
        return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_PROFILE':
      return { ...state, userProfile: action.payload, activePage: 'ROLE_FIT' };
    case 'SET_ROLE':
       // When a new role is selected, clear the old roadmap
      return { ...state, selectedRole: action.payload, roadmap: [], activePage: 'ROADMAP' };
    case 'SET_ROADMAP':
      return { ...state, roadmap: action.payload };
    case 'TOGGLE_GOAL': {
      const newRoadmap = JSON.parse(JSON.stringify(state.roadmap)); // Deep copy
      const goal = newRoadmap[action.payload.weekIndex].goals[action.payload.goalIndex];
      goal.completed = !goal.completed;
      return { ...state, roadmap: newRoadmap };
    }
    case 'UPDATE_NOTE': {
        const newRoadmap = JSON.parse(JSON.stringify(state.roadmap)); // Deep copy
        newRoadmap[action.payload.weekIndex].notes = action.payload.note;
        return { ...state, roadmap: newRoadmap };
    }
    case 'ADD_PROJECT':
        return { ...state, portfolio: [...state.portfolio, action.payload] };
    case 'REMOVE_PROJECT':
        return { ...state, portfolio: state.portfolio.filter(p => p.id !== action.payload)};
    case 'SUBMIT_ASSESSMENT':
        return {
            ...state,
            assessmentAttempts: [
                ...state.assessmentAttempts.filter(a => a.assessmentId !== action.payload.assessmentId),
                action.payload
            ]
        };
    case 'SET_LOADING':
      return { ...state, isLoading: { ...state.isLoading, [action.payload.key]: action.payload.value } };
    case 'SET_INTERVIEW_MESSAGES':
      return { ...state, interviewMessages: action.payload, interviewSummary: null };
    case 'SET_INTERVIEW_SUMMARY':
      return { ...state, interviewSummary: action.payload };
    case 'SET_INTERVIEW_FIELD':
      return { ...state, interviewField: action.payload };
    case 'CLEAR_INTERVIEW':
      return { 
        ...state, 
        interviewMessages: [], 
        interviewSummary: null, 
        interviewField: null 
      };
    case 'START_ASSESSMENT':
      return { ...state, activeAssessment: { id: action.payload, answers: {}, currentQuestionIndex: 0 }};
    case 'UPDATE_ASSESSMENT_PROGRESS':
        if (!state.activeAssessment) return state;
        return { 
            ...state, 
            activeAssessment: { 
                ...state.activeAssessment,
                answers: action.payload.answers, 
                currentQuestionIndex: action.payload.currentQuestionIndex 
            }
        };
    case 'CLEAR_ACTIVE_ASSESSMENT':
        return { ...state, activeAssessment: null };
    case 'UPDATE_WIDGET_VISIBILITY':
      const newWidgets = { ...state.dashboardWidgets, [action.payload.widget]: action.payload.isVisible };
      return { ...state, dashboardWidgets: newWidgets };
    default:
      return state;
  }
};

// Context
interface AppContextProps {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Provider Component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    try {
        const storedState = localStorage.getItem('appState');
        const storedTheme = localStorage.getItem('careerAdvisorTheme');
        
        const theme: 'light' | 'dark' = storedTheme === 'dark' ? 'dark' : 'light';

        if (storedState) {
            const parsedState = JSON.parse(storedState);
            // Ensure theme from its own storage takes precedence
            return { ...parsedState, theme };
        }
        return { ...initial, theme };
    } catch (error) {
        console.error("Could not parse stored state:", error);
        return initial;
    }
  });

  useEffect(() => {
    // Persist entire state to localStorage on change
    try {
        const stateToSave = { ...state };
        localStorage.setItem('appState', JSON.stringify(stateToSave));
        // Also save theme separately for initial load
        localStorage.setItem('careerAdvisorTheme', state.theme);
    } catch (error) {
        console.error("Could not save state to localStorage:", error);
    }
  }, [state]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};