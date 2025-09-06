import React, { useEffect, useMemo } from 'react';
import { aiService } from '../services/aiService';
import { useAppContext } from '../state/AppContext';

const LearningRoadmap: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { selectedRole, roadmap } = state;
  const isLoading = state.isLoading['roadmap'];

  useEffect(() => {
    if (selectedRole && roadmap.length === 0) {
      const fetchRoadmap = async () => {
        dispatch({ type: 'SET_LOADING', payload: { key: 'roadmap', value: true } });
        const generatedRoadmap = await aiService.getRoadmap(selectedRole);
        dispatch({ type: 'SET_ROADMAP', payload: generatedRoadmap });
        dispatch({ type: 'SET_LOADING', payload: { key: 'roadmap', value: false } });
      };
      fetchRoadmap();
    }
  }, [selectedRole, dispatch, roadmap.length]);

  const handleToggleGoal = (weekIndex: number, goalIndex: number) => {
    dispatch({ type: 'TOGGLE_GOAL', payload: { weekIndex, goalIndex } });
  };
  
  const handleNoteChange = (weekIndex: number, note: string) => {
    dispatch({ type: 'UPDATE_NOTE', payload: { weekIndex, note } });
  };
  
  const overallProgress = useMemo(() => {
    const allGoals = roadmap.flatMap(week => week.goals);
    if (allGoals.length === 0) return 0;
    const completedGoals = allGoals.filter(goal => goal.completed).length;
    return Math.round((completedGoals / allGoals.length) * 100);
  }, [roadmap]);

  if (!selectedRole) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No career path selected.</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Please go to the 'My Profile' page, find your role fit, and select a career to generate a roadmap.</p>
         <button onClick={() => dispatch({type: 'NAVIVATE', payload: 'PROFILE'})} className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">
          Go to Profile
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-12 flex flex-col items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Generating your personalized roadmap...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Your Roadmap to Becoming a {selectedRole.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Follow this weekly plan to build the skills you need.</p>
      </div>
      <div className="text-center mb-10">
          <button 
            onClick={() => dispatch({ type: 'NAVIVATE', payload: 'ROLE_FIT' })}
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            &larr; Back to Recommendations
          </button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Overall Progress</h3>
        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{overallProgress}% Complete</p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-3">
            <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" style={{ width: `${overallProgress}%` }}></div>
        </div>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
        <div className="space-y-10">
          {roadmap.map((week, weekIndex) => (
            <div key={week.week} className="relative">
              <div className="absolute -left-5 top-1.5 w-4 h-4 bg-indigo-600 dark:bg-indigo-500 rounded-full border-4 border-sky-50 dark:border-slate-900"></div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Week {week.week}: {week.title}</h3>
                <div className="mt-4">
                  <ul className="space-y-3">
                    {week.goals.map((goal, goalIndex) => (
                      <li key={goalIndex} className="flex items-start cursor-pointer group" onClick={() => handleToggleGoal(weekIndex, goalIndex)}>
                        <div className="mt-1 mr-3 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center border-2 border-slate-300 dark:border-slate-500 group-hover:border-indigo-500 transition-colors">
                          {goal.completed && <div className="h-3 w-3 rounded-full bg-indigo-600 dark:bg-indigo-500"></div>}
                        </div>
                        <span className={`text-sm text-slate-700 dark:text-slate-300 ${goal.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>{goal.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                      <label htmlFor={`notes-${week.week}`} className="text-xs font-semibold text-slate-500 dark:text-slate-400">My Notes</label>
                      <textarea
                          id={`notes-${week.week}`}
                          rows={2}
                          value={week.notes || ''}
                          onChange={(e) => handleNoteChange(weekIndex, e.target.value)}
                          placeholder="Add personal notes or links..."
                          className="mt-1 block w-full px-3 py-2 border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:placeholder-slate-500 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningRoadmap;