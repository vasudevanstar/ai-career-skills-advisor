import React, { useState } from 'react';
import { AppPage } from './types';
import { useAppContext } from './state/AppContext';
import AuthPage from './components/AuthPage';
import ProfileIntake from './components/Onboarding';
import RoleFit from './components/SkillAssessment';
import LearningRoadmap from './components/CareerPaths';
import MockInterview from './components/MockInterview';
import ResumeCoach from './components/icons/BrandIcon';
import Dashboard from './components/icons/RoadmapIcons';
import JobExplorer from './components/JobExplorer';
import SkillAssessmentsPage from './components/SkillAssessmentsPage';
import { aiService } from './services/aiService';

const ThemeToggle: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const isDarkMode = state.theme === 'dark';
    const tooltipText = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
    return (
        <button 
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })} 
            aria-label={tooltipText}
            title={tooltipText}
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900"
        >
            {state.theme === 'dark' ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
            ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z"></path></svg>
            )}
        </button>
    )
}

const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { activePage } = state;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: { page: AppPage; label: string }[] = [
    { page: 'DASHBOARD', label: 'Dashboard' },
    { page: 'PROFILE', label: 'My Profile' },
    { page: 'ROADMAP', label: 'Roadmap' },
    { page: 'ASSESSMENTS', label: 'Assessments' },
    { page: 'JOBS', label: 'Jobs' },
    { page: 'INTERVIEW', label: 'Mock Interview' },
    { page: 'RESUME', label: 'Resume Coach' },
  ];
  
  const handleNavigation = (page: AppPage) => {
    dispatch({ type: 'NAVIVATE', payload: page });
    setIsMenuOpen(false);
  }

  const handleLogout = () => {
      dispatch({ type: 'LOGOUT' });
  }

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm dark:shadow-slate-800 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNavigation('HOME')} className="flex items-center space-x-2" aria-label="Go to homepage">
             <svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-7.5 0C4.508 19.64 2.25 16.184 2.25 12c0-4.184 2.258-7.64 5.25-9.429m6.75 18.858C17.492 19.64 19.75 16.184 19.75 12c0-4.184-2.258-7.64-5.25-9.429m0 18.858l-6.75-18.858M12 6.75h.008v.008H12V6.75z" />
            </svg>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">AI Career Advisor</span>
          </button>
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ page, label }) => (
              <button 
                key={page} 
                onClick={() => handleNavigation(page)} 
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${activePage === page ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-slate-800' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                aria-current={activePage === page ? 'page' : undefined}
                >
                {label}
              </button>
            ))}
             <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
             <ThemeToggle />
             <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">Logout</button>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open navigation menu" aria-expanded={isMenuOpen}>
                <svg className="h-6 w-6 text-slate-700 dark:text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
            <div className="md:hidden pt-2 pb-4 space-y-1">
                {navLinks.map(({ page, label }) => (
                  <button 
                    key={page} 
                    onClick={() => handleNavigation(page)} 
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${activePage === page ? 'text-indigo-700 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-800'}`}
                    aria-current={activePage === page ? 'page' : undefined}
                  >
                    {label}
                  </button>
                ))}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 flex justify-center">
                    <button onClick={handleLogout} className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Logout</button>
                </div>
            </div>
        )}
      </nav>
    </header>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400">
            {icon}
        </div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-4">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">{children}</p>
    </div>
);

const Home: React.FC = () => {
  const { dispatch } = useAppContext();
  const handleStart = () => dispatch({ type: 'NAVIVATE', payload: 'DASHBOARD' });

  return (
    <div className="bg-white dark:bg-slate-900">
      <div className="text-center container mx-auto px-6 py-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Personalized Career Guidance for <span className="text-indigo-600 dark:text-indigo-400">Indian Students</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
          Unlock your potential. We use AI to map your skills, recommend the perfect career path, and create a personalized roadmap for your success.
        </p>
        <button onClick={handleStart} className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
          Start My Career Journey
        </button>
      </div>
      <div className="bg-sky-50/70 dark:bg-slate-900/50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-12">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3M5.636 5.636l-1.414-1.414M19.778 19.778l-1.414-1.414M18.364 5.636l-1.414 1.414M4.222 19.778l1.414-1.414M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>} title="1. AI Role Fit">
                      Discover roles that match your skills and interests with our AI-powered analysis.
                  </FeatureCard>
                  <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>} title="2. Skill Gap Analysis">
                      Identify the exact skills you need to land your dream job in the Indian market.
                  </FeatureCard>
                  <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 13v-3m6 3v-3m0 0l-6-3m6 3V7" /></svg>} title="3. Custom Roadmap">
                      Get a weekly, actionable learning plan with resources from NPTEL, Coursera, etc.
                  </FeatureCard>
                  <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>} title="4. Interview Prep">
                      Practice with our AI mock interviewer and get instant feedback to improve.
                  </FeatureCard>
              </div>
          </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { state } = useAppContext();

  if (!state.user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (state.activePage) {
      case 'HOME':
        return <Home />;
      case 'PROFILE':
        return <ProfileIntake />;
      case 'ROLE_FIT':
        return <RoleFit />;
      case 'ROADMAP':
        return <LearningRoadmap />;
      case 'ASSESSMENTS':
        return <SkillAssessmentsPage />;
      case 'JOBS':
        return <JobExplorer />;
      case 'INTERVIEW':
        return <MockInterview />;
      case 'RESUME':
        return <ResumeCoach />;
      case 'DASHBOARD':
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-sky-50/70 dark:bg-slate-900/50 min-h-screen font-sans">
      <Header />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;