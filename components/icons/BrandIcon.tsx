import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { useAppContext } from '../../state/AppContext';
import { Project } from '../../types';

const PortfolioItem: React.FC<{ project: Project; onRemove: (id: string) => void }> = ({ project, onRemove }) => (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">{project.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{project.description}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">View Project &rarr;</a>
            </div>
            <button onClick={() => onRemove(project.id)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400" aria-label="Remove project">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
);

const ResumeCoach: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { portfolio } = state;
    const [feedback, setFeedback] = useState<{ strengths: string; improvements: string; points: string[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    
    const [newProject, setNewProject] = useState({ title: '', description: '', link: '' });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsLoading(true);
        setFeedback(null);

        const result = await aiService.getResumeFeedback(file);
        setFeedback(result);
        setIsLoading(false);
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProject(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProject = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newProject.title || !newProject.link) return;
        const project: Project = { ...newProject, id: new Date().toISOString() };
        dispatch({ type: 'ADD_PROJECT', payload: project });
        setNewProject({ title: '', description: '', link: '' });
    };

    const handleRemoveProject = (id: string) => {
        dispatch({ type: 'REMOVE_PROJECT', payload: id });
    };
    
    const formInputClasses = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-400";


    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Resume & Portfolio Coach</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Get AI feedback on your resume and build your project portfolio.</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                 <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">AI Resume Analyzer</h3>
                <label htmlFor="resume-upload" className="w-full cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 13.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-4.5M3 13.5V6a2.25 2.25 0 012.25-2.25h3.75l1.5-1.5h3.75l1.5 1.5h3.75A2.25 2.25 0 0121 6v7.5" /></svg>
                    <span className="mt-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">{fileName ? `Selected: ${fileName}` : 'Click to upload your resume (PDF)'}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{fileName ? 'Choose another file to re-analyze.' : 'We\'ll analyze it instantly.'}</p>
                </label>
                <input id="resume-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange}/>

                {isLoading && (
                    <div className="text-center py-8 flex justify-center items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="font-semibold text-slate-600 dark:text-slate-300">Analyzing your resume...</p>
                    </div>
                )}

                {feedback && !isLoading && (
                    <div className="mt-8 space-y-6 animate-fade-in">
                        <div><h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">Strengths</h3><p className="mt-1 text-slate-600 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-md">{feedback.strengths}</p></div>
                        <div><h3 className="text-lg font-bold text-amber-700 dark:text-amber-400">Areas for Improvement</h3><p className="mt-1 text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md">{feedback.improvements}</p></div>
                        <div><h3 className="text-lg font-bold text-sky-700 dark:text-sky-400">Suggested ATS-Friendly Bullet Points</h3><ul className="mt-2 list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">{feedback.points.map((point, i) => <li key={i}>{point}</li>)}</ul></div>
                    </div>
                )}
            </div>

             <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">My Portfolio</h3>
                <div className="space-y-4 mb-6">
                    {portfolio.length > 0 ? portfolio.map(p => <PortfolioItem key={p.id} project={p} onRemove={handleRemoveProject} />) : <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">Your portfolio is empty. Add a project below.</p>}
                </div>
                <form onSubmit={handleAddProject} className="space-y-4 p-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Add a New Project</h4>
                    <div><input type="text" name="title" value={newProject.title} onChange={handleProjectChange} placeholder="Project Title" className={formInputClasses} required /></div>
                    <div><textarea name="description" value={newProject.description} onChange={handleProjectChange} placeholder="Short description" rows={2} className={formInputClasses} /></div>
                    <div><input type="url" name="link" value={newProject.link} onChange={handleProjectChange} placeholder="https://github.com/user/repo" className={formInputClasses} required /></div>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md text-sm hover:bg-indigo-700">Add Project</button>
                </form>
            </div>
        </div>
    );
};

export default ResumeCoach;