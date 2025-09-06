import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../state/AppContext';
import { aiService } from '../services/aiService';
import { JobListing } from '../types';

type SortByType = 'relevance' | 'date' | 'company';

const JobCard: React.FC<{ job: JobListing }> = ({ job }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-shadow hover:shadow-lg">
        <div className="flex justify-between items-start gap-4">
            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{job.title}</h3>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{job.company}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{job.location} &bull; {job.experience}</p>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{job.workStyle} &bull; {job.industry}</p>
            </div>
            {job.matchScore !== undefined && (
                <div className="text-center flex-shrink-0">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{job.matchScore}%</div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Match Score</p>
                </div>
            )}
        </div>
        {job.matchScore !== undefined && (
             <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                <div className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" style={{ width: `${job.matchScore}%` }}></div>
            </div>
        )}
        {job.matchReason && (
             <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-4">"{job.matchReason}"</p>
        )}
        <div className="mt-4">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map(skill => (
                    <span key={skill} className="px-2 py-1 text-xs font-medium text-sky-800 bg-sky-100 dark:text-sky-300 dark:bg-sky-900/50 rounded-full">{skill}</span>
                ))}
            </div>
        </div>
        <div className="mt-6 flex justify-between items-center">
            <p className="text-xs text-slate-400">
                Posted: {new Date(job.postedDate).toLocaleDateString()}
            </p>
            <a href={job.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                View & Apply
            </a>
        </div>
    </div>
);

const JobExplorer: React.FC = () => {
    const { state } = useAppContext();
    const { selectedRole, userProfile } = state;
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortByType>('relevance');
    const [filters, setFilters] = useState({
        role: selectedRole?.title || '',
        location: '',
        experience: 'all',
        companySize: 'all',
        industry: 'all',
        workStyle: 'all',
        stream: userProfile?.stream || 'all'
    });

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            const fetchedJobs = await aiService.getJobs(filters, userProfile, selectedRole);
            setJobs(fetchedJobs);
            setIsLoading(false);
        };
        fetchJobs();
    }, [filters, userProfile, selectedRole]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const sortedJobs = useMemo(() => {
        return [...jobs].sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
                case 'company':
                    return a.company.localeCompare(b.company);
                case 'relevance':
                default:
                    return (b.matchScore || 0) - (a.matchScore || 0);
            }
        });
    }, [jobs, sortBy]);
    
    const formInputClasses = "block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm";
    const labelClasses = "text-xs font-semibold text-slate-500 dark:text-slate-400";

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Job Explorer</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Discover opportunities that match your skills and career path.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8 sticky top-20 z-40">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
                    <div>
                        <label htmlFor="role" className={labelClasses}>Role / Keyword</label>
                        <input type="text" name="role" id="role" value={filters.role} onChange={handleFilterChange} placeholder="e.g., Frontend Developer" className={`${formInputClasses} mt-1`} />
                    </div>
                    <div>
                        <label htmlFor="location" className={labelClasses}>Location</label>
                        <input type="text" name="location" id="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g., Bengaluru" className={`${formInputClasses} mt-1`} />
                    </div>
                    <div>
                        <label htmlFor="experience" className={labelClasses}>Experience</label>
                        <select name="experience" id="experience" value={filters.experience} onChange={handleFilterChange} className={`${formInputClasses} mt-1`}>
                            <option value="all">All Levels</option>
                            <option value="Internship">Internship</option>
                            <option value="0-1 Years">0-1 Years</option>
                            <option value="2+ Years">2+ Years</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="workStyle" className={labelClasses}>Work Style</label>
                        <select name="workStyle" id="workStyle" value={filters.workStyle} onChange={handleFilterChange} className={`${formInputClasses} mt-1`}>
                            <option value="all">All</option>
                            <option value="On-site">On-site</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                     <div className="col-span-2 md:col-span-4 lg:col-span-5 border-t border-slate-200 dark:border-slate-700 my-2"></div>
                     <div>
                        <label htmlFor="companySize" className={labelClasses}>Company Size</label>
                        <select name="companySize" id="companySize" value={filters.companySize} onChange={handleFilterChange} className={`${formInputClasses} mt-1`}>
                            <option value="all">All Sizes</option>
                            <option value="Startup">Startup (1-50)</option>
                            <option value="Mid-Size">Mid-Size (51-500)</option>
                            <option value="Large">Large (501+)</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="industry" className={labelClasses}>Industry</label>
                        <select name="industry" id="industry" value={filters.industry} onChange={handleFilterChange} className={`${formInputClasses} mt-1`}>
                            <option value="all">All Industries</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="FinTech">FinTech</option>
                            <option value="SaaS">SaaS</option>
                            <option value="Healthcare">Healthcare</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="stream" className={labelClasses}>Academic Stream</label>
                        <select name="stream" id="stream" value={filters.stream} onChange={handleFilterChange} className={`${formInputClasses} mt-1`}>
                             <option value="all">All Streams</option>
                             <option value="Computer Science">Computer Science</option>
                             <option value="IT">IT</option>
                             <option value="Statistics">Statistics</option>
                             <option value="Business">Business</option>
                        </select>
                    </div>
                    <div className="md:col-start-4">
                        <label htmlFor="sortBy" className={labelClasses}>Sort By</label>
                        <select name="sortBy" id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortByType)} className={`${formInputClasses} mt-1`}>
                            <option value="relevance">Relevance</option>
                            <option value="date">Date Posted</option>
                            <option value="company">Company Name</option>
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                 <div className="text-center p-12 flex flex-col items-center justify-center">
                    <svg className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="font-semibold text-slate-600 dark:text-slate-300">Our AI is finding the best jobs for you...</p>
                </div>
            ) : sortedJobs.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sortedJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No jobs found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Our AI couldn't find a match for your current filters. Try adjusting them or check back later.</p>
                </div>
            )}
        </div>
    );
};

export default JobExplorer;