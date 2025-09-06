import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CareerRole, RoadmapWeek, ChatMessage, JobListing, Assessment, User } from '../types';
import { CAREER_ROLES_DATA, ROADMAP_DATA, RESUME_FEEDBACK, JOB_LISTINGS_DATA, ASSESSMENTS_DATA, INTERVIEW_SUMMARY } from './mockData';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const interviewModel = 'gemini-2.5-flash';

// This service handles all interactions with the Gemini AI and provides mock authentication.
const aiService = {
  // --- Mock Authentication ---
  loginUser: async (email, password): Promise<User> => {
    console.log(`Mock Login for: ${email}`);
    await new Promise(res => setTimeout(res, 500));
    // In a real app, you'd validate this. Here, we just return a mock user.
    return { uid: email, email };
  },
  signUpUser: async (email, password): Promise<User> => {
    console.log(`Mock Sign Up for: ${email}`);
    await new Promise(res => setTimeout(res, 500));
    return { uid: email, email };
  },

  // --- AI-Powered Features ---
  
  getRoleFit: async (profile: UserProfile | null): Promise<{ recommended: CareerRole[], additional: CareerRole[] }> => {
    console.log('AI Service: Generating role fit for profile:', profile);
    if (!profile?.stream || !profile.interests) {
        return { recommended: [], additional: [] };
    }

    const availableRolesForPrompt = CAREER_ROLES_DATA.map(({ id, title, description, totalSkills }) => ({
        id, title, description, totalSkills,
    }));

    const prompt = `
      You are an expert career counselor for students in India.
      Based on the user's profile below, recommend the top 3 most suitable career roles from the provided list of available roles.

      User Profile:
      - Academic Stream: "${profile.stream}"
      - Interests: "${profile.interests}"
      - Stated Career Goals: "${profile.goals}"

      Available Roles:
      ${JSON.stringify(availableRolesForPrompt, null, 2)}

      For each of the 3 recommended roles, you must provide:
      1.  'id': The exact ID of the role from the list.
      2.  'fitScore': A percentage score (0-100) indicating how well the role matches the user's profile.
      3.  'explanation': A brief, encouraging, single-sentence explanation for why it's a good fit.
      4.  'missingSkills': An array of 3-4 skills from the role's 'totalSkills' list that a student is likely missing and should focus on learning.

      Return ONLY a JSON object with a single key "recommendations" which is an array of these 3 role objects.
    `;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    fitScore: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                    missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["id", "fitScore", "explanation", "missingSkills"],
                },
              },
            },
            required: ["recommendations"],
          },
        },
      });

      const jsonText = response.text.trim();
      const aiRecommendations = JSON.parse(jsonText).recommendations;

      const aiDataMap = new Map(aiRecommendations.map((rec: any) => [rec.id, rec]));
      
      const recommended = CAREER_ROLES_DATA
        .filter(role => aiDataMap.has(role.id))
        .map(role => {
            const aiData = aiDataMap.get(role.id);
            const recommendationData = (typeof aiData === 'object' && aiData !== null) ? aiData : {};
            return { ...role, ...recommendationData };
        })
        .sort((a, b) => b.fitScore - a.fitScore);
        
      const recommendedIds = new Set(recommended.map(r => r.id));
      const additional = CAREER_ROLES_DATA.filter(role => 
        !recommendedIds.has(role.id) && role.relevantStreams.includes(profile.stream)
      );

      return { recommended, additional };
      
    } catch (error) {
      console.error("Gemini API call failed for getRoleFit. Falling back to mock data.", error);
      const recommended = CAREER_ROLES_DATA.filter(role => role.relevantStreams.includes(profile.stream)).slice(0, 3);
      const additional = CAREER_ROLES_DATA.filter(role => role.relevantStreams.includes(profile.stream)).slice(3, 8);
      return { recommended, additional };
    }
  },

  getRoadmap: async (role: CareerRole): Promise<RoadmapWeek[]> => {
    const prompt = `
        You are a career coach creating a learning plan. Generate a 4-week, actionable roadmap for a student aiming for a "${role.title}" role.
        They need to learn these specific skills: ${role.missingSkills.join(', ')}.
        For each week, provide a title and 2-3 specific, small, achievable goals.
        The goals should be practical, like "Complete Chapter 3 of [Course]" or "Build a small project using [Technology]".
        Return ONLY a JSON object with a single key "roadmap" which is an array of 4 week objects.
        Each week object must have: 'week' (number), 'title' (string), and 'goals' (an array of strings).
    `;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    week: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["week", "title", "goals"],
                },
              },
            },
            required: ["roadmap"],
          }
        },
      });
      const jsonText = response.text.trim();
      const generatedRoadmap = JSON.parse(jsonText).roadmap;
      return generatedRoadmap.map((week: any) => ({
          ...week,
          goals: week.goals.map((goalText: string) => ({ text: goalText, completed: false })),
          notes: '',
      }));
    } catch (error) {
      console.error("Gemini API call failed for getRoadmap. Falling back to mock data.", error);
      const mock = ROADMAP_DATA[role.id] || ROADMAP_DATA['frontend_dev'];
       return mock.map(week => ({ ...week, goals: week.goals.map(g => ({ ...g, completed: false })), notes: '' }));
    }
  },

  getResumeFeedback: async (file: File) => {
    await new Promise(res => setTimeout(res, 1500));
    return RESUME_FEEDBACK;
  },

  getInterviewResponse: async (messages: ChatMessage[], interviewField: string): Promise<ChatMessage> => {
     try {
      const chat = ai.chats.create({ 
        model: interviewModel,
        config: {
          systemInstruction: `You are an expert interviewer named Avishkar, conducting a mock interview for a "${interviewField}" role in India. Ask relevant behavioral and technical questions one by one. Keep your responses concise and conversational.`
        }
      });
      const lastMessages = messages.slice(-4); 
      const response = await chat.sendMessage({ 
        message: lastMessages.map(m => `${m.sender}: ${m.text}`).join('\n') 
      });

      return { sender: 'ai', text: response.text };
    } catch (error) {
      console.error("Gemini API call failed for getInterviewResponse.", error);
      return { sender: 'ai', text: "I'm having a bit of trouble connecting. Could you please repeat your last answer?" };
    }
  },

  getInterviewSummary: async (messages: ChatMessage[], interviewField: string) => {
     if (messages.length <= 1) return INTERVIEW_SUMMARY;
     const transcript = messages.map(m => `${m.sender === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`).join('\n');
     const prompt = `
        You are an expert interview coach. Based on the following interview transcript for a "${interviewField}" role, provide constructive feedback.
        Analyze the candidate's responses for clarity, structure (like the STAR method), technical depth, and communication skills.
        
        Transcript:
        ${transcript}

        Return ONLY a JSON object with two keys:
        1. "strengths": A paragraph summarizing the candidate's strong points.
        2. "improvements": A paragraph with actionable advice on areas for improvement.
     `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Gemini API call failed for getInterviewSummary. Falling back to mock data.", error);
        return INTERVIEW_SUMMARY;
    }
  },

  getAssessment: async (assessmentId: string): Promise<Assessment | null> => {
    const assessment = ASSESSMENTS_DATA.find(a => a.id === assessmentId);
    if (!assessment) return null;

    if (assessment.questions.length > 0) {
      return assessment;
    }

    const prompt = `
      Generate 5 multiple-choice questions for a skill assessment on "${assessment.skill}".
      Each question should have one correct answer.
      Return ONLY a JSON object with a "questions" key, containing an array of 5 question objects.
      Each object must have: "id" (string, e.g., "q1"), "question" (string), "options" (array of 4 strings), and "answer" (the correct string from options).
    `;
    try {
       const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    answer: { type: Type.STRING },
                  },
                  required: ["id", "question", "options", "answer"],
                },
              },
            },
            required: ["questions"],
          },
        },
      });
      const jsonText = response.text.trim();
      const generated = JSON.parse(jsonText);
      return { ...assessment, questions: generated.questions };
    } catch (error) {
       console.error(`Gemini API call failed for getAssessment (${assessment.skill}).`, error);
       return assessment;
    }
  },

  getRecommendedAssessments: async (role: CareerRole): Promise<Assessment[]> => {
      const relevantSkills = role.missingSkills;
      const availableAssessments = ASSESSMENTS_DATA.map(({ id, title, skill }) => ({ id, title, skill }));
      
      const prompt = `
        Based on the user's need to learn these skills: [${relevantSkills.join(', ')}], recommend the top 3 most critical assessments to take from the list below.
        
        Available Assessments:
        ${JSON.stringify(availableAssessments)}

        Return ONLY a JSON object with a key "recommendations" which is an array of assessment IDs.
      `;
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        const jsonText = response.text.trim();
        const recommendedIds = new Set(JSON.parse(jsonText).recommendations);
        return ASSESSMENTS_DATA.filter(a => recommendedIds.has(a.id));
      } catch (error) {
         console.error("Gemini API call failed for getRecommendedAssessments. Falling back.", error);
         return ASSESSMENTS_DATA.filter(a => relevantSkills.includes(a.skill)).slice(0, 3);
      }
  },

  getAssessmentsForRole: async (role: CareerRole): Promise<Assessment[]> => {
    const skillSet = new Set(role.totalSkills);
    return ASSESSMENTS_DATA.filter(assessment => skillSet.has(assessment.skill));
  },

  getJobs: async (
    filters: any,
    profile: UserProfile | null,
    role: CareerRole | null
  ): Promise<JobListing[]> => {
    const prompt = `
        You are an AI job matching expert for students in India.
        Based on the user's profile and their search filters, analyze the following list of available jobs.
        Recommend the most relevant jobs by providing a match score and a brief reason.

        User Profile:
        - Academic Stream: "${profile?.stream || 'Not provided'}"
        - Interests: "${profile?.interests || 'Not provided'}"
        - Key Skills (from selected career path): [${role?.totalSkills.join(', ') || 'Not provided'}]

        User's Search Filters:
        ${JSON.stringify(filters, null, 2)}
        
        Available Jobs:
        ${JSON.stringify(JOB_LISTINGS_DATA.map(({id, title, company, location, experience, requiredSkills, industry, workStyle}) => ({id, title, company, location, experience, requiredSkills, industry, workStyle})), null, 2)}

        Return ONLY a JSON object with a single key "jobs" which is an array of objects.
        For each job you recommend, provide:
        1. 'id': The exact ID of the job from the list.
        2. 'matchScore': A percentage score (0-100) indicating how well the job matches the user's complete profile and filters.
        3. 'matchReason': A brief, single-sentence explanation for why it's a good match.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        const jsonText = response.text.trim();
        const aiJobs = JSON.parse(jsonText).jobs;
        const aiDataMap = new Map(aiJobs.map((rec: any) => [rec.id, rec]));
        
        return JOB_LISTINGS_DATA
            .filter(job => aiDataMap.has(job.id))
            .map(job => {
                const aiData = aiDataMap.get(job.id);
                const matchData = (typeof aiData === 'object' && aiData !== null) ? aiData : {};
                return { ...job, ...matchData };
            });

    } catch (error) {
      console.error("Gemini API call failed for getJobs. Falling back to basic filtering.", error);
      return JOB_LISTINGS_DATA.filter(job => {
          const roleMatch = filters.role ? job.title.toLowerCase().includes(filters.role.toLowerCase()) : true;
          const locationMatch = filters.location ? job.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
          const expMatch = filters.experience === 'all' || job.experience === filters.experience;
          const sizeMatch = filters.companySize === 'all' || job.companySize === filters.companySize;
          const industryMatch = filters.industry === 'all' || job.industry === filters.industry;
          const workStyleMatch = filters.workStyle === 'all' || job.workStyle === filters.workStyle;
          const streamMatch = filters.stream === 'all' || job.relevantStreams.includes(filters.stream);
          return roleMatch && locationMatch && expMatch && sizeMatch && industryMatch && workStyleMatch && streamMatch;
      });
    }
  },
};

export { aiService };
