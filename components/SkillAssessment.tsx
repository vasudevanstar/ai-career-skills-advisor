import React, { useState, useEffect } from 'react';
import { CareerRole, ResourceLink } from '../types';
import { aiService } from '../services/aiService';
import { useAppContext } from '../state/AppContext';

const SkillGap: React.FC<{ skills: string[]; resources: ResourceLink[] }> = ({ skills, resources }) => (
  <div className="bg-sky-50/70 dark:bg-slate-800/50 p-4 rounded-lg mt-4">
    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Skill Gap to Address:</h4>
    <ul className="list-disc list-inside mt-2 text-slate-600 dark:text-slate-400 text-sm space-y-1">
      {skills.map(skill => <li key={skill}>{skill}</li>)}
    </ul>
    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mt-4">Recommended Resources:</h4>
    <div className="mt-2 space-y-1">
      {resources.map(res => (
        <a key={res.name} href={res.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline block">
          {res.name} &rarr;
        </a>
      ))}
    </div>
  </div>
);

const RoleCard: React.FC<{ role: CareerRole; onSelect: (role: CareerRole) => void }> = ({ role, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{role.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{role.description}</p>
          </div>
          <div className="text-center flex-shrink-0">
             <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{role.fitScore}%</div>
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Fit Score</p>
          </div>
        </div>
         <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2">
            <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" style={{ width: `${role.fitScore}%` }}></div>
         </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-4">"{role.explanation}"</p>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 mt-4">
          {isExpanded ? 'Hide Skill Gap' : 'View Skill Gap & Resources'}
        </button>
        {isExpanded && <SkillGap skills={role.missingSkills} resources={role.resources} />}
      </div>
      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
        <button onClick={() => onSelect(role)} className="w-full text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-200">
          Generate Learning Roadmap &rarr;
        </button>
      </div>
    </div>
  );
};

const RoleFit: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [recommendations, setRecommendations] = useState<{ recommended: CareerRole[], additional: CareerRole[] }>({ recommended: [], additional: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      const result = await aiService.getRoleFit(state.userProfile);
      setRecommendations(result);
      setIsLoading(false);
    };
    // Only fetch if a profile exists
    if(state.userProfile?.name) {
       fetchRoles();
    } else {
        // If there's no profile, redirect to profile page
        dispatch({ type: 'NAVIVATE', payload: 'PROFILE' });
    }
  }, [state.userProfile, dispatch]);
  
  const handleSelectRole = (role: CareerRole) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  };

  if (isLoading) {
    return (
      <div className="text-center p-12 flex flex-col items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Finding your perfect career match...</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Our AI is analyzing your profile.</p>
      </div>
    );
  }

  if (!isLoading && recommendations.recommended.length === 0) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No recommendations found.</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">We couldn't find specific career recommendations. Please try updating your profile.</p>
         <button onClick={() => dispatch({type: 'NAVIVATE', payload: 'PROFILE'})} className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">
          Update Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">AI-Powered Recommendations</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Here are the top roles that best match your unique profile and aspirations.</p>
      </div>
      <div className="space-y-8">
        {recommendations.recommended.map(role => (
          <RoleCard key={role.id} role={role} onSelect={handleSelectRole} />
        ))}
      </div>

      {recommendations.additional.length > 0 && (
          <>
            <div className="text-center my-16 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">More Roles for Your Stream</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Explore other popular career paths for {state.userProfile?.stream} students.</p>
            </div>
            <div className="space-y-8">
                {recommendations.additional.map(role => (
                <RoleCard key={role.id} role={role} onSelect={handleSelectRole} />
                ))}
            </div>
          </>
      )}
    </div>
  );
};

export default RoleFit;