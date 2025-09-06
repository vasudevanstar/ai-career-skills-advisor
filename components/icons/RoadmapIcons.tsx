import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../state/AppContext';
import { aiService } from '../../services/aiService';
import { Assessment, DashboardWidgets } from '../../types';

const Badge: React.FC<{ title: string; children: React.ReactNode; earned: boolean }> = ({ title, children, earned }) => (
    <div className={`text-center transition-opacity ${earned ? 'opacity-100' : 'opacity-40'}`}>
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 ${earned ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 border-amber-200 dark:border-amber-800/50' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'}`}>
            {children}
        </div>
        <p className="mt-2 font-semibold text-slate-700 dark:text-slate-200 text-sm">{title}</p>
        {!earned && <p className="text-xs text-slate-400 dark:text-slate-500">(Locked)</p>}
    </div>
);

const RecommendedAssessmentWidget: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { selectedRole, assessmentAttempts } = state;
    const [recommended, setRecommended] = useState<Assessment | null>(null);

    useEffect(() => {
        const fetchRec = async () => {
            if (selectedRole) {
                const assessments = await aiService.getRecommendedAssessments(selectedRole);
                const completedIds = new Set(assessmentAttempts.map(a => a.assessmentId));
                const firstUncompleted = assessments.find(a => !completedIds.has(a.id));
                setRecommended(firstUncompleted || null);
            }
        };
        fetchRec();
    }, [selectedRole, assessmentAttempts]);

    if (!selectedRole || !recommended) {
        return null; // Don't show the widget if no role is selected or no recommendation is available
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Recommended Assessment</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">Test your skills in <span className="font-bold">{recommended.skill}</span> to validate your progress.</p>
            <button
                onClick={() => dispatch({ type: 'NAVIVATE', payload: 'ASSESSMENTS' })}
                className="w-full text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-200"
            >
                Go to Assessments &rarr;
            </button>
        </div>
    )
}

const ActiveSessionsWidget: React.FC = () => {
    const { state, dispatch } = useAppContext();
    
    // Check for an interview in progress (more than the initial message, and no summary yet)
    const hasInterviewProgress = state.interviewMessages.length > 1 && !state.interviewSummary;
    
    // Check for an assessment in progress
    const hasAssessmentProgress = !!state.activeAssessment;

    if (!hasInterviewProgress && !hasAssessmentProgress) {
        return null; // Don't render if there's no active session
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
                Resume Your Sessions
            </h4>
            <div className="space-y-3">
                {hasInterviewProgress && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 first:border-t-0 first:pt-0">
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">You have an ongoing mock interview.</p>
                        <button
                            onClick={() => dispatch({ type: 'NAVIVATE', payload: 'INTERVIEW' })}
                            className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-200"
                        >
                            Continue Interview &rarr;
                        </button>
                    </div>
                )}
                {hasAssessmentProgress && (
                     <div className="pt-3 border-t border-slate-200 dark:border-slate-700 first:border-t-0 first:pt-0">
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">You have a skill assessment in progress.</p>
                        <button
                            onClick={() => dispatch({ type: 'NAVIVATE', payload: 'ASSESSMENTS' })}
                            className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-200"
                        >
                            Resume Assessment &rarr;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const PersonalizeDashboardModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useAppContext();
    const { dashboardWidgets } = state;

    const handleToggle = (widget: keyof DashboardWidgets, isVisible: boolean) => {
        dispatch({ type: 'UPDATE_WIDGET_VISIBILITY', payload: { widget, isVisible } });
    };
    
    if (!isOpen) return null;

    const widgetConfig: { key: keyof DashboardWidgets; label: string }[] = [
        { key: 'activeSessions', label: 'Resume Your Sessions' },
        { key: 'nextGoal', label: 'Next Goal' },
        { key: 'skillsToDevelop', label: 'Skills to Develop' },
        { key: 'recommendedAssessment', label: 'Recommended Assessment' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-sm w-full m-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personalize Dashboard</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">Choose which widgets to display.</p>
                <div className="space-y-3">
                    {widgetConfig.map(({ key, label }) => (
                        <label key={key} htmlFor={key} className="flex items-center justify-between cursor-pointer">
                            <span className="text-slate-700 dark:text-slate-300">{label}</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id={key}
                                    className="sr-only peer"
                                    checked={dashboardWidgets[key]}
                                    onChange={(e) => handleToggle(key, e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                            </div>
                        </label>
                    ))}
                </div>
                 <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Done</button>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { state } = useAppContext();
    const { userProfile, selectedRole, roadmap, theme, assessmentAttempts, dashboardWidgets } = state;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const chartData = roadmap.map(week => ({
        name: `W${week.week}`,
        progress: Math.round((week.goals.filter(g => g.completed).length / week.goals.length) * 100) || 0,
    }));
    
    const nextGoal = roadmap.flatMap(week => week.goals).find(goal => !goal.completed)?.text;
    const skillsToDevelop = selectedRole?.missingSkills || [];
    
    const badges = {
        profile: !!userProfile,
        career: !!selectedRole,
        roadmap: roadmap.length > 0,
        quizMaster: assessmentAttempts.length > 0,
    };
    
    const isDark = theme === 'dark';

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <PersonalizeDashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Your Progress Dashboard</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Track your learning journey and celebrate your achievements.</p>
            </div>
             <div className="text-center mb-10">
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900">
                    Personalize Dashboard
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Roadmap Progress (% Completion)</h3>
                    {roadmap.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                                    <XAxis dataKey="name" tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }} />
                                    <YAxis unit="%" domain={[0, 100]} tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }} />
                                    <Tooltip
                                        contentStyle={{ 
                                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                            borderColor: isDark ? '#374151' : '#e5e7eb'
                                        }}
                                    />
                                    <Bar dataKey="progress" fill={isDark ? "#818cf8" : "#4f46e5"} name="Completion" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-center text-slate-500 dark:text-slate-400">
                            <p>Select a career to generate a roadmap and see your progress here.</p>
                        </div>
                    )}
                </div>
                <div className="space-y-6">
                    {dashboardWidgets.activeSessions && <ActiveSessionsWidget />}
                    {dashboardWidgets.nextGoal && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Next Goal</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">{nextGoal || 'All goals completed!'}</p>
                        </div>
                    )}
                    {dashboardWidgets.skillsToDevelop && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Skills to Develop</h4>
                            {skillsToDevelop.length > 0 ? (
                                 <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc list-inside space-y-1">
                                    {skillsToDevelop.slice(0, 3).map(skill => <li key={skill}>{skill}</li>)}
                                 </ul>
                            ) : <p className="text-sm text-slate-500 dark:text-slate-400">No career selected.</p>}
                        </div>
                    )}
                    {dashboardWidgets.recommendedAssessment && <RecommendedAssessmentWidget />}
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center">Badges Earned</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <Badge title="Profile Pro" earned={badges.profile}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </Badge>
                     <Badge title="Career Explorer" earned={badges.career}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 13v-3m6 3v-3m0 0l-6-3m6 3V7" />
                        </svg>
                    </Badge>
                     <Badge title="Roadmap Ready" earned={badges.roadmap}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </Badge>
                    <Badge title="Quiz Master" earned={badges.quizMaster}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;