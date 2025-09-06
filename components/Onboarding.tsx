import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { useAppContext } from '../state/AppContext';

const ProfileIntake: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const isLoading = state.isLoading['profile'];

  const [formData, setFormData] = useState<UserProfile>(state.userProfile || {
    name: '',
    email: state.user?.email || '',
    stream: '',
    interests: '',
    language: 'English',
    goals: '',
  });
  const [error, setError] = useState<string | null>(null);

  const profileCompleteness = useMemo(() => {
    const fieldsToTrack: (keyof Omit<UserProfile, 'email' | 'language'>)[] = ['name', 'stream', 'interests', 'goals'];
    const totalFields = fieldsToTrack.length;
    const filledFields = fieldsToTrack.reduce((count, field) => {
      // Ensure formData[field] is not null/undefined before calling trim()
      const fieldValue = formData[field];
      return count + (fieldValue && typeof fieldValue === 'string' && fieldValue.trim() !== '' ? 1 : 0);
    }, 0);
    return Math.round((filledFields / totalFields) * 100);
  }, [formData]);

  const formInputClasses = "block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-slate-50 dark:disabled:bg-slate-700";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.stream && formData.interests && formData.goals) {
      setError(null);
      dispatch({ type: 'SET_LOADING', payload: { key: 'profile', value: true } });
      // Simulate API call
      setTimeout(() => {
        dispatch({ type: 'SET_PROFILE', payload: formData });
        dispatch({ type: 'SET_LOADING', payload: { key: 'profile', value: false } });
      }, 1000);
    } else {
      setError('Please fill out all required fields.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 max-w-2xl mx-auto my-12 p-6 md:p-10 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Your Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">This helps our AI understand your background and aspirations.</p>
      </div>

       <div className="mb-8 px-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Profile Completion</span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{profileCompleteness}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
          <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${profileCompleteness}%` }}></div>
        </div>
        {profileCompleteness < 100 && (
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">Fill out all fields to get the most accurate recommendations!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={isLoading}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={formInputClasses} placeholder="e.g., Priya Kumar" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={formInputClasses} placeholder="you@example.com" required disabled={!!state.user?.email} />
            </div>
          </div>

          <div>
            <label htmlFor="stream" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Academic Stream</label>
            <select name="stream" id="stream" value={formData.stream} onChange={handleChange} className={formInputClasses} required>
              <option value="" disabled>Select your stream</option>
              <optgroup label="Engineering & Technology">
                <option value="Aeronautical Engineering">Aeronautical Engineering</option>
                <option value="Aerospace Engineering">Aerospace Engineering</option>
                <option value="Agricultural Engineering">Agricultural Engineering</option>
                <option value="Automobile Engineering">Automobile Engineering</option>
                <option value="Biochemical Engineering">Biochemical Engineering</option>
                <option value="Biomedical Engineering">Biomedical Engineering</option>
                <option value="Biotechnology Engineering">Biotechnology Engineering</option>
                <option value="Chemical Engineering">Chemical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electrical & Electronics Engineering (EEE)">Electrical & Electronics Engineering (EEE)</option>
                <option value="Electronics & Communication Engineering (ECE)">Electronics & Communication Engineering (ECE)</option>
                <option value="Environmental Engineering">Environmental Engineering</option>
                <option value="Industrial Engineering">Industrial Engineering</option>
                <option value="Information Technology (IT)">Information Technology (IT)</option>
                <option value="Instrumentation & Control Engineering">Instrumentation & Control Engineering</option>
                <option value="Marine Engineering">Marine Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                <option value="Metallurgical Engineering">Metallurgical Engineering</option>
                <option value="Mining Engineering">Mining Engineering</option>
                <option value="Petroleum Engineering">Petroleum Engineering</option>
                <option value="Production Engineering">Production Engineering</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Telecommunication Engineering">Telecommunication Engineering</option>
              </optgroup>
              <optgroup label="Science">
                <option value="Agriculture">Agriculture</option>
                <option value="Astrophysics">Astrophysics</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Biology">Biology</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Botany">Botany</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Computer Science (B.Sc.)">Computer Science (B.Sc.)</option>
                <option value="Computer Applications (BCA)">Computer Applications (BCA)</option>
                <option value="Electronics">Electronics</option>
                <option value="Environmental Science">Environmental Science</option>
                <option value="Forensic Science">Forensic Science</option>
                <option value="Forestry">Forestry</option>
                <option value="Geology">Geology</option>
                <option value="Home Science">Home Science</option>
                <option value="Horticulture">Horticulture</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Nursing">Nursing</option>
                <option value="Nutrition & Dietetics">Nutrition & Dietetics</option>
                <option value="Physics">Physics</option>
                <option value="Statistics">Statistics</option>
                <option value="Zoology">Zoology</option>
              </optgroup>
              <optgroup label="Business, Management & Commerce">
                <option value="Accounting & Finance">Accounting & Finance</option>
                <option value="Banking & Insurance">Banking & Insurance</option>
                <option value="Business Administration (BBA)">Business Administration (BBA)</option>
                <option value="Business Analytics">Business Analytics</option>
                <option value="Commerce (B.Com)">Commerce (B.Com)</option>
                <option value="Economics">Economics</option>
                <option value="Event Management">Event Management</option>
                <option value="Finance">Finance</option>
                <option value="Hospitality & Hotel Management">Hospitality & Hotel Management</option>
                <option value="Human Resource Management">Human Resource Management</option>
                <option value="International Business">International Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Retail Management">Retail Management</option>
                <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                <option value="Travel & Tourism Management">Travel & Tourism Management</option>
              </optgroup>
              <optgroup label="Arts & Humanities">
                <option value="Anthropology">Anthropology</option>
                <option value="Archaeology">Archaeology</option>
                <option value="Arts (B.A.)">Arts (B.A.)</option>
                <option value="Communication & Journalism">Communication & Journalism</option>
                <option value="Design (Fashion, Interior, Product)">Design (Fashion, Interior, Product)</option>
                <option value="Education (B.Ed.)">Education (B.Ed.)</option>
                <option value="English Literature">English Literature</option>
                <option value="Fine Arts (BFA)">Fine Arts (BFA)</option>
                <option value="Foreign Languages">Foreign Languages</option>
                <option value="Geography">Geography</option>
                <option value="History">History</option>
                <option value="Journalism & Mass Communication">Journalism & Mass Communication</option>
                <option value="Liberal Arts">Liberal Arts</option>
                <option value="Music">Music</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Political Science">Political Science</option>
                <option value="Psychology">Psychology</option>
                <option value="Public Administration">Public Administration</option>
                <option value="Social Work">Social Work</option>
                <option value="Sociology">Sociology</option>
                <option value="Theatre & Performing Arts">Theatre & Performing Arts</option>
              </optgroup>
              <optgroup label="Medicine & Healthcare">
                <option value="Ayurveda (BAMS)">Ayurveda (BAMS)</option>
                <option value="Dentistry (BDS)">Dentistry (BDS)</option>
                <option value="Homeopathy (BHMS)">Homeopathy (BHMS)</option>
                <option value="Medical Laboratory Technology (MLT)">Medical Laboratory Technology (MLT)</option>
                <option value="Medicine & Surgery (MBBS)">Medicine & Surgery (MBBS)</option>
                <option value="Occupational Therapy">Occupational Therapy</option>
                <option value="Optometry">Optometry</option>
                <option value="Pharmacy (B.Pharm)">Pharmacy (B.Pharm)</option>
                <option value="Physiotherapy (BPT)">Physiotherapy (BPT)</option>
                <option value="Veterinary Science (B.V.Sc)">Veterinary Science (B.V.Sc)</option>
              </optgroup>
              <optgroup label="Law">
                <option value="Bachelor of Laws (LLB)">Bachelor of Laws (LLB)</option>
                <option value="Integrated Law (BA LLB, BBA LLB, etc.)">Integrated Law (BA LLB, BBA LLB, etc.)</option>
              </optgroup>
              <optgroup label="Other Professional Streams">
                <option value="Architecture (B.Arch)">Architecture (B.Arch)</option>
                <option value="Animation & Multimedia">Animation & Multimedia</option>
                <option value="Culinary Arts">Culinary Arts</option>
                <option value="Physical Education">Physical Education</option>
                <option value="Urban Planning">Urban Planning</option>
                <option value="Other">Other</option>
              </optgroup>
            </select>
          </div>
          
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Interests</label>
            <input type="text" name="interests" id="interests" value={formData.interests} onChange={handleChange} className={formInputClasses} placeholder="e.g., AI, Web Development, Public Speaking" required />
          </div>

          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">What are your career goals?</label>
            <textarea name="goals" id="goals" rows={3} value={formData.goals} onChange={handleChange} className={formInputClasses} placeholder="e.g., To work at a product-based company, specialize in cloud computing..." required />
          </div>
          
          <div>
              <label htmlFor="resume" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Upload Resume (Optional)</label>
              <input type="file" name="resume" id="resume" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/50 dark:file:text-indigo-300 file:text-indigo-700 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/80 disabled:opacity-50" />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">AI will parse it to improve recommendations. (Mocked)</p>
          </div>
        </fieldset>
        
        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
                {error}
            </div>
        )}

        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed">
            {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {isLoading ? 'Analyzing...' : 'Find My Career Fit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileIntake;