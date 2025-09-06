import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChatMessage, Assessment, CareerRole } from '../types';
import { aiService } from '../services/aiService';
import { useAppContext } from '../state/AppContext';
import { CAREER_ROLES_DATA } from '../services/mockData';

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
    </div>
);

const RoleAssessments: React.FC<{ title: string; assessments: Assessment[]; onNavigate: () => void }> = ({ title, assessments, onNavigate }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{title}</h3>
        {assessments.length > 0 ? (
            <>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    {assessments.slice(0, 4).map(assessment => ( // Show a max of 4 to keep it tidy
                        <li key={assessment.id} className="flex items-start">
                             <svg className="h-5 w-5 text-sky-500 dark:text-sky-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span><strong className="text-slate-700 dark:text-slate-300">{assessment.skill}:</strong> {assessment.title}</span>
                        </li>
                    ))}
                </ul>
                <button onClick={onNavigate} className="mt-4 w-full text-center text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-200">
                    View All Assessments &rarr;
                </button>
            </>
        ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No specific assessments found for this role.</p>
        )}
    </div>
);

const InterviewTips: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 h-full">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Interview Tips</h3>
        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                <span><strong>Use the STAR Method:</strong> Describe the <strong>S</strong>ituation, your <strong>T</strong>ask, the <strong>A</strong>ction you took, and the <strong>R</strong>esult.</span>
            </li>
            <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span><strong>Quantify Achievements:</strong> Use numbers and data to show impact (e.g., "improved performance by 15%").</span>
            </li>
        </ul>
    </div>
);

const STREAM_DEFINITIONS: Record<string, string[]> = {
    "Technology & IT": [
        'Computer Science & Engineering', 'Information Technology (IT)', 'Software Engineering', 'Computer Applications (BCA)', 'Data Science', 'Artificial Intelligence', 'Cybersecurity'
    ],
    "Business & Finance": [
        'Business Analytics', 'Economics', 'Business Administration (BBA)', 'Marketing', 'Commerce (B.Com)', 'Finance', 'Accounting & Finance', 'Supply Chain & Logistics', 'Operations Management'
    ],
    "Engineering (Core & Allied)": [
        'Electronics & Communication Engineering (ECE)', 'Electrical & Electronics Engineering (EEE)', 'Instrumentation & Control Engineering', 'Mechatronics Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Aerospace Engineering', 'Aeronautical Engineering', 'Automobile Engineering', 'Biotechnology Engineering', 'Environmental Engineering', 'Industrial Engineering'
    ],
    "Healthcare & Life Sciences": [
        'Medicine & Surgery (MBBS)', 'Nursing', 'Pharmacy (B.Pharm)', 'Public Health', 'Biology', 'Biotechnology', 'Biochemistry', 'Microbiology', 'Genetics'
    ],
    "Design, Arts & Humanities": [
        'Design (Fashion, Interior, Product)', 'Fine Arts (BFA)', 'Communication & Journalism', 'Psychology', 'Sociology', 'Arts (B.A.)', 'Education (B.Ed.)', 'Game Development', 'Animation & Multimedia'
    ]
};

const MockInterview: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { interviewMessages, interviewSummary, interviewField, selectedRole } = state;
    const isLoading = state.isLoading['interview'];
    const [input, setInput] = useState('');
    const [recommendedAssessments, setRecommendedAssessments] = useState<Assessment[]>([]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [interviewMessages, isLoading, interviewSummary]);

    useEffect(() => {
        const fetchAssessmentsForRole = async () => {
            if (interviewField) {
                 if (selectedRole && selectedRole.title === interviewField) {
                    const assessments = await aiService.getRecommendedAssessments(selectedRole);
                    setRecommendedAssessments(assessments);
                } else {
                    const role = CAREER_ROLES_DATA.find(r => r.title === interviewField);
                    if (role) {
                        const assessments = await aiService.getAssessmentsForRole(role);
                        setRecommendedAssessments(assessments);
                    }
                }
            } else {
                 setRecommendedAssessments([]);
            }
        };
        fetchAssessmentsForRole();
    }, [interviewField, selectedRole]);

    const rolesByStreamCategory = useMemo(() => {
        const categoryMap: Record<string, Set<CareerRole>> = {
            "Technology & IT": new Set(),
            "Business & Finance": new Set(),
            "Engineering (Core & Allied)": new Set(),
            "Healthcare & Life Sciences": new Set(),
            "Design, Arts & Humanities": new Set(),
            "General / Cross-Disciplinary": new Set(),
        };

        const streamToCategoryMap: Record<string, keyof typeof STREAM_DEFINITIONS> = {};
        Object.entries(STREAM_DEFINITIONS).forEach(([category, streams]) => {
            streams.forEach(stream => {
                streamToCategoryMap[stream] = category as keyof typeof STREAM_DEFINITIONS;
            });
        });

        CAREER_ROLES_DATA.forEach(role => {
            role.relevantStreams.forEach(stream => {
                if (stream === 'Any' || stream === 'Engineering (All Streams)') {
                    categoryMap["General / Cross-Disciplinary"].add(role);
                } else {
                    const category = streamToCategoryMap[stream];
                    if (category && categoryMap[category]) {
                        categoryMap[category].add(role);
                    } else {
                        categoryMap["General / Cross-Disciplinary"].add(role);
                    }
                }
            });
        });

        const result: Record<string, CareerRole[]> = {};
        Object.entries(categoryMap).forEach(([category, rolesSet]) => {
            if(rolesSet.size > 0) {
               result[category] = Array.from(rolesSet).sort((a, b) => a.title.localeCompare(b.title));
            }
        });
        return result;
    }, []);

    const handleSend = async () => {
        if (!input.trim() || interviewSummary || !interviewField) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        const updatedMessages = [...interviewMessages, userMessage];
        dispatch({ type: 'SET_INTERVIEW_MESSAGES', payload: updatedMessages });
        setInput('');
        dispatch({ type: 'SET_LOADING', payload: { key: 'interview', value: true } });

        const aiResponse = await aiService.getInterviewResponse(updatedMessages, interviewField);
        dispatch({ type: 'SET_INTERVIEW_MESSAGES', payload: [...updatedMessages, aiResponse] });
        dispatch({ type: 'SET_LOADING', payload: { key: 'interview', value: false } });
    };

    const handleEndInterview = async () => {
        if (!interviewField) return;
        dispatch({ type: 'SET_LOADING', payload: { key: 'interview', value: true } });
        const feedback = await aiService.getInterviewSummary(interviewMessages, interviewField);
        dispatch({ type: 'SET_INTERVIEW_SUMMARY', payload: feedback });
        dispatch({ type: 'SET_LOADING', payload: { key: 'interview', value: false } });
    };
    
    const handleChangeRole = () => {
        dispatch({ type: 'CLEAR_INTERVIEW' });
    };
    
    const handleStartInterview = (field: string) => {
        const initialMessage: ChatMessage = { 
            sender: 'ai', 
            text: `Hello! I'm Avishkar, your AI interviewer. I'll be conducting a mock interview for a ${field} role. To start, please tell me about yourself.` 
        };
        dispatch({ type: 'SET_INTERVIEW_FIELD', payload: field });
        dispatch({ type: 'SET_INTERVIEW_MESSAGES', payload: [initialMessage] });
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) handleSend();
    }
    
    const sessionEnded = !!interviewSummary;
    const isPersonalized = selectedRole && selectedRole.title === interviewField;

    if (!interviewField) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Select an Interview Field</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Choose a role from your relevant stream to start your mock interview.</p>
                </div>
                <div className="space-y-4">
                    {Object.entries(rolesByStreamCategory).map(([category, roles]) => {
                        if (roles.length === 0) return null;
                        const isOpen = openCategory === category;
                        return (
                            <div key={category} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <button
                                    onClick={() => setOpenCategory(isOpen ? null : category)}
                                    className="w-full flex justify-between items-center p-4 text-left font-bold text-slate-800 dark:text-white"
                                    aria-expanded={isOpen}
                                >
                                    <span>{category} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({roles.length} roles)</span></span>
                                    <svg
                                        className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isOpen && (
                                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {roles.map(role => (
                                                <button
                                                    key={role.id}
                                                    onClick={() => handleStartInterview(role.title)}
                                                    className="p-4 text-left bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
                                                >
                                                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">{role.title}</h3>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Mock Interview: {interviewField}</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Practice your interview skills. Be clear and concise in your answers.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 h-[70vh] flex flex-col p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                        {interviewMessages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                                    msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                                }`}>{msg.text}</div>
                            </div>
                        ))}
                        {isLoading && !sessionEnded && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800"><TypingIndicator /></div>
                            </div>
                        )}
                        {interviewSummary && (
                            <div className="p-4 bg-sky-50 dark:bg-slate-700/50 rounded-lg border-sky-200 dark:border-slate-600 border mt-4">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Interview Feedback</h3>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">Strengths</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{interviewSummary.strengths}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-amber-700 dark:text-amber-400">Areas for Improvement</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{interviewSummary.improvements}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {!sessionEnded ? (
                      <div className="mt-4 flex items-center">
                          <button onClick={handleChangeRole} title="Change Role" className="mr-2 p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                 <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                          </button>
                          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your answer..." disabled={isLoading} className="flex-grow px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                          <button onClick={handleSend} disabled={isLoading} className="ml-3 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-full shadow-sm hover:bg-indigo-700 disabled:bg-slate-400 transition-colors">Send</button>
                          <button onClick={handleEndInterview} disabled={isLoading} className="ml-2 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-full shadow-sm hover:bg-red-700 disabled:bg-slate-400 transition-colors text-sm">End</button>
                      </div>
                    ) : (
                      <div className="mt-4 text-center">
                        <p className="text-slate-600 dark:text-slate-400 font-semibold">Interview session has ended.</p>
                        <button onClick={handleChangeRole} className="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-indigo-700">Start New Interview</button>
                      </div>
                    )}
                </div>
                <div className="lg:col-span-1 space-y-8">
                   <RoleAssessments
                        title={isPersonalized ? "AI Recommended Assessments" : "Relevant Assessments"}
                        assessments={recommendedAssessments}
                        onNavigate={() => dispatch({ type: 'NAVIVATE', payload: 'ASSESSMENTS' })}
                   />
                   <InterviewTips />
                </div>
            </div>
        </div>
    );
};

export default MockInterview;