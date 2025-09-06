import React, { useState, useEffect } from 'react';
import { useAppContext } from '../state/AppContext';
import { aiService } from '../services/aiService';
import { Assessment, AssessmentAttempt, CareerRole } from '../types';
import { CAREER_ROLES_DATA } from '../services/mockData';

type View = 'list' | 'quiz' | 'results';

const QuizRunner: React.FC<{
    assessment: Assessment;
    onSubmit: (score: number) => void;
    onBack: () => void;
}> = ({ assessment, onSubmit, onBack }) => {
    const { state, dispatch } = useAppContext();
    const { activeAssessment } = state;

    const currentQuestionIndex = activeAssessment?.currentQuestionIndex || 0;
    const answers = activeAssessment?.answers || {};
    const currentQuestion = assessment.questions[currentQuestionIndex];

    const handleSelectOption = (option: string) => {
        if (!activeAssessment) return;
        const newAnswers = { ...answers, [currentQuestion.id]: option };
        dispatch({ type: 'UPDATE_ASSESSMENT_PROGRESS', payload: { answers: newAnswers, currentQuestionIndex } });
    };

    const handleNext = () => {
        if (!activeAssessment) return;
        if (currentQuestionIndex < assessment.questions.length - 1) {
            dispatch({ 
                type: 'UPDATE_ASSESSMENT_PROGRESS', 
                payload: { answers, currentQuestionIndex: currentQuestionIndex + 1 } 
            });
        }
    };
    
    const handleSubmit = () => {
        let correctAnswers = 0;
        for (const q of assessment.questions) {
             if (answers[q.id] === q.answer) {
                correctAnswers++;
            }
        }
        const score = Math.round((correctAnswers / assessment.questions.length) * 100);
        onSubmit(score);
    };

    if (!currentQuestion) {
        return <div>Loading question...</div>;
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="mb-6">
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Question {currentQuestionIndex + 1} of {assessment.questions.length}</p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-2">{currentQuestion.question}</h3>
            </div>
            <div className="space-y-3">
                {currentQuestion.options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleSelectOption(option)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors text-sm ${
                            answers[currentQuestion.id] === option 
                            ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500' 
                            : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <div className="mt-8 flex justify-between items-center">
                <button onClick={onBack} className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                    &larr; Back to List
                </button>
                {currentQuestionIndex < assessment.questions.length - 1 ? (
                    <button onClick={handleNext} disabled={!answers[currentQuestion.id]} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-slate-400">Next</button>
                ) : (
                    <button onClick={handleSubmit} disabled={!answers[currentQuestion.id]} className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-sm hover:bg-emerald-700 disabled:bg-slate-400">Submit</button>
                )}
            </div>
        </div>
    );
};

const AssessmentCard: React.FC<{
    assessment: Assessment,
    attempt?: AssessmentAttempt,
    isActive: boolean,
    onStart: (id: string) => void
}> = ({ assessment, attempt, isActive, onStart }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white">{assessment.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Topic: {assessment.skill}</p>
            </div>
            {attempt ? (
                <div className="text-center">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{attempt.score}%</p>
                    <p className="text-xs text-slate-400">Completed</p>
                </div>
            ) : (
                <button onClick={() => onStart(assessment.id)} className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors ${isActive ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                    {isActive ? 'Resume Quiz' : 'Start Quiz'}
                </button>
            )}
        </div>
    );
}

const SkillAssessmentsPage: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { selectedRole, assessmentAttempts, activeAssessment } = state;

    const [view, setView] = useState<View>('list');
    const [isLoading, setIsLoading] = useState(true);
    const [currentAssessmentDetails, setCurrentAssessmentDetails] = useState<Assessment | null>(null);
    const [lastScore, setLastScore] = useState(0);

    const [displayedRole, setDisplayedRole] = useState<CareerRole | null>(selectedRole);
    const [isSelectingRole, setIsSelectingRole] = useState<boolean>(!selectedRole);
    
    const [recommendedAssessments, setRecommendedAssessments] = useState<Assessment[]>([]);
    const [allAssessmentsForRole, setAllAssessmentsForRole] = useState<Assessment[]>([]);
    
    useEffect(() => {
        const fetchAssessments = async () => {
            if (displayedRole) {
                setIsLoading(true);
                const [recs, all] = await Promise.all([
                    aiService.getRecommendedAssessments(displayedRole),
                    aiService.getAssessmentsForRole(displayedRole),
                ]);
                setRecommendedAssessments(recs);
                setAllAssessmentsForRole(all);
                setIsLoading(false);
            } else {
                setRecommendedAssessments([]);
                setAllAssessmentsForRole([]);
                setIsLoading(false);
            }
        };
        fetchAssessments();
    }, [displayedRole]);
    
    useEffect(() => {
        const resumeAssessment = async () => {
            if (activeAssessment) {
                const assessmentDetails = await aiService.getAssessment(activeAssessment.id);
                if (assessmentDetails) {
                    setCurrentAssessmentDetails(assessmentDetails);
                    setView('quiz');
                } else {
                    dispatch({ type: 'CLEAR_ACTIVE_ASSESSMENT' });
                }
            }
        };
        if (activeAssessment && !currentAssessmentDetails) {
            resumeAssessment();
        }
    }, [activeAssessment, dispatch, currentAssessmentDetails]);
    
    const handleSelectRoleForAssessment = (role: CareerRole) => {
        setDisplayedRole(role);
        setIsSelectingRole(false);
    };

    const handleStartQuiz = (assessmentId: string) => {
        dispatch({ type: 'START_ASSESSMENT', payload: assessmentId });
    };
    
    const handleSubmitQuiz = (score: number) => {
        if (currentAssessmentDetails) {
            const attempt: AssessmentAttempt = {
                assessmentId: currentAssessmentDetails.id,
                score,
                completedAt: new Date().toISOString(),
            };
            dispatch({ type: 'SUBMIT_ASSESSMENT', payload: attempt });
            dispatch({ type: 'CLEAR_ACTIVE_ASSESSMENT' });
            setLastScore(score);
            setView('results');
        }
    };
    
    const handleReturnToList = () => {
        setCurrentAssessmentDetails(null);
        setView('list');
    };

    const renderContent = () => {
        if (isSelectingRole || !displayedRole) {
            return (
                <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Select a Field to Assess</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">Choose a career path to view its relevant skill assessments.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1">
                        {CAREER_ROLES_DATA.map(role => (
                            <button
                                key={role.id}
                                onClick={() => handleSelectRoleForAssessment(role)}
                                className="p-4 text-left bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
                            >
                                <h4 className="font-bold text-slate-800 dark:text-white">{role.title}</h4>
                            </button>
                        ))}
                    </div>
                    {selectedRole && (
                         <div className="text-center mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                            <button 
                                onClick={() => { setDisplayedRole(selectedRole); setIsSelectingRole(false); }}
                                className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:underline"
                            >
                               Cancel
                            </button>
                         </div>
                    )}
                </div>
            );
        }

        if (view === 'quiz' && currentAssessmentDetails) {
            return <QuizRunner assessment={currentAssessmentDetails} onSubmit={handleSubmitQuiz} onBack={handleReturnToList} />;
        }
        
        if (view === 'results') {
            return (
                 <div className="bg-white dark:bg-slate-800 text-center p-8 md:p-12 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Assessment Complete!</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">You scored:</p>
                    <p className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 my-4">{lastScore}%</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your score has been saved to your profile.</p>
                    <button onClick={() => { setCurrentAssessmentDetails(null); setView('list'); }} className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">
                        Back to Assessments
                    </button>
                </div>
            )
        }
        
        const recommendedIds = new Set(recommendedAssessments.map(a => a.id));
        const additionalAssessments = allAssessmentsForRole.filter(a => !recommendedIds.has(a.id));

        return (
            <div>
                <div className="mb-8 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Showing assessments for:</p>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{displayedRole.title}</h4>
                    </div>
                    <button onClick={() => setIsSelectingRole(true)} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Change Role</button>
                </div>

                {isLoading ? (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-10">Generating AI recommendations and loading assessments...</p>
                ) : recommendedAssessments.length === 0 && additionalAssessments.length === 0 ? (
                    <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-lg">
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No Assessments Found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">There are no available assessments for the selected role. Please try a different one.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {recommendedAssessments.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Top AI Recommendations</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6">Our AI suggests starting with these assessments to address your key skill gaps for a {displayedRole.title} role.</p>
                                <div className="space-y-4">
                                    {recommendedAssessments.map(assessment => (
                                        <AssessmentCard
                                            key={assessment.id}
                                            assessment={assessment}
                                            attempt={assessmentAttempts.find(a => a.assessmentId === assessment.id)}
                                            isActive={activeAssessment?.id === assessment.id}
                                            onStart={handleStartQuiz}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {additionalAssessments.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Full Assessment Library</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6">Explore all available assessments relevant to the {displayedRole.title} field.</p>
                                <div className="space-y-4">
                                    {additionalAssessments.map(assessment => (
                                         <AssessmentCard
                                            key={assessment.id}
                                            assessment={assessment}
                                            attempt={assessmentAttempts.find(a => a.assessmentId === assessment.id)}
                                            isActive={activeAssessment?.id === assessment.id}
                                            onStart={handleStartQuiz}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Skill Assessment Center</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Get AI-driven recommendations or freely explore quizzes for any role.</p>
            </div>
            {renderContent()}
        </div>
    );
};

export default SkillAssessmentsPage;