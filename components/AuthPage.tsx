import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { useAppContext } from '../state/AppContext';

const AuthPage: React.FC = () => {
    const { dispatch } = useAppContext();
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Password should be at least 6 characters.");
            return;
        }
        if (!isLoginView && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            let user;
            if (isLoginView) {
                user = await aiService.loginUser(email, password);
            } else {
                user = await aiService.signUpUser(email, password);
            }
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    const handlePasswordReset = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`A password reset link has been sent to ${resetEmail} (mocked).`);
        setShowResetModal(false);
        setResetEmail('');
    };

    const formInputClasses = "block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

    return (
        <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-slate-900 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <svg className="h-12 w-12 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-7.5 0C4.508 19.64 2.25 16.184 2.25 12c0-4.184 2.258-7.64 5.25-9.429m6.75 18.858C17.492 19.64 19.75 16.184 19.75 12c0-4.184-2.258-7.64-5.25-9.429m0 18.858l-6.75-18.858M12 6.75h.008v.008H12V6.75z" />
                    </svg>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mt-4">AI Career Advisor</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{isLoginView ? 'Sign in to your account' : 'Create a new account'}</p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleAuth} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className={formInputClasses} />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className={formInputClasses} />
                        </div>
                        {!isLoginView && (
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                                <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className={formInputClasses} />
                            </div>
                        )}
                        {isLoginView && (
                            <div className="text-sm text-right">
                                <button type="button" onClick={() => setShowResetModal(true)} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Forgot your password?</button>
                            </div>
                        )}
                        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                                {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Sign Up')}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center text-sm">
                        <button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            {isLoginView ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
                        </button>
                    </div>
                </div>
            </div>

            {showResetModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl max-w-sm w-full m-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reset Password</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Enter your email and we'll send you a link to reset your password (mocked).</p>
                        <form onSubmit={handlePasswordReset} className="mt-4 space-y-4">
                            <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required placeholder="you@example.com" className={formInputClasses} />
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowResetModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Send Link</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthPage;