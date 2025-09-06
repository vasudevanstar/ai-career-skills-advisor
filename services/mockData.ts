import { CareerRole, JobListing, RoadmapWeek, Assessment } from '../types';

export const CAREER_ROLES_DATA: CareerRole[] = [
  // --- Technology & IT ---
  {
    id: 'software_developer_fullstack',
    title: 'Full Stack Developer',
    description: 'Work on both the frontend (client-side) and backend (server-side) of web applications, handling everything from UI to databases.',
    fitScore: 87,
    explanation: 'Your versatility and desire to understand the complete picture make you ideal for a full stack role.',
    missingSkills: ['Backend Framework (Node.js/Django)', 'Database Management (SQL/NoSQL)', 'API Design'],
    totalSkills: ['HTML/CSS/JS', 'Frontend Framework (React/Angular/Vue)', 'Backend Framework (Node.js/Django)', 'Database Management (SQL/NoSQL)', 'API Design', 'Git', 'Cloud Deployment'],
    relevantStreams: ['Computer Science & Engineering', 'Information Technology (IT)', 'Computer Applications (BCA)', 'Software Engineering'],
    resources: [{ name: 'The Odin Project', url: '#' }]
  },
  {
    id: 'frontend_dev',
    title: 'Frontend Developer',
    description: 'Build and maintain the user-facing part of web applications, focusing on user experience and responsive design.',
    fitScore: 82,
    explanation: 'Your creative interests and passion for building things make you a great candidate for creating beautiful user interfaces.',
    missingSkills: ['React.js / Next.js', 'TypeScript', 'State Management (Redux/Context)'],
    totalSkills: ['HTML', 'CSS', 'JavaScript', 'React.js / Next.js', 'TypeScript', 'Git', 'State Management (Redux/Context)', 'Responsive Design'],
    relevantStreams: ['Computer Science & Engineering', 'Information Technology (IT)', 'Computer Applications (BCA)', 'Software Engineering', 'Electronics & Communication Engineering (ECE)'],
    resources: [
      { name: 'SWAYAM: Introduction to Web Development', url: '#' },
      { name: 'FreeCodeCamp: Responsive Web Design', url: '#' },
    ]
  },
  {
    id: 'backend_dev',
    title: 'Backend Developer',
    description: 'Build and maintain the server-side logic, databases, and APIs that power web applications.',
    fitScore: 85,
    explanation: 'Your logical thinking and interest in system architecture make you a strong candidate for backend development.',
    missingSkills: ['Node.js/Express or Django/Flask', 'Database Management (SQL/NoSQL)', 'API Design (REST/GraphQL)'],
    totalSkills: ['Python/Java/Go/Node.js', 'Node.js/Express or Django/Flask', 'Database Management (SQL/NoSQL)', 'API Design (REST/GraphQL)', 'System Design', 'Git', 'Cloud Basics (AWS/GCP)'],
    relevantStreams: ['Computer Science & Engineering', 'Information Technology (IT)', 'Software Engineering', 'Electronics & Communication Engineering (ECE)'],
    resources: [{ name: 'NPTEL: Introduction to Database Systems', url: '#' }]
  },
  {
    id: 'ai_ml_engineer',
    title: 'AI / Machine Learning Engineer',
    description: 'Design, build, and deploy machine learning models to solve business problems and create intelligent applications.',
    fitScore: 89,
    explanation: 'Your passion for cutting-edge technology and algorithms is ideal for a career in artificial intelligence.',
    missingSkills: ['Deep Learning (TensorFlow/PyTorch)', 'Natural Language Processing (NLP)', 'Model Deployment (MLOps)'],
    totalSkills: ['Python', 'Deep Learning (TensorFlow/PyTorch)', 'Natural Language Processing (NLP)', 'Computer Vision', 'Model Deployment (MLOps)', 'Advanced Mathematics', 'Algorithm Design'],
    relevantStreams: ['Computer Science & Engineering', 'Data Science', 'Artificial Intelligence', 'Mathematics'],
    resources: [{ name: 'DeepLearning.AI: Machine Learning Specialization', url: '#' }]
  },
  {
    id: 'data_scientist',
    title: 'Data Scientist',
    description: 'Use advanced analytics, including machine learning and predictive modeling, to extract valuable insights from complex datasets.',
    fitScore: 90,
    explanation: 'Your analytical mindset and interest in statistics are a perfect match for the field of data science.',
    missingSkills: ['Machine Learning Models', 'Statistical Analysis', 'Big Data Technologies (Spark)'],
    totalSkills: ['Python (scikit-learn, TensorFlow)', 'R', 'SQL', 'Machine Learning Models', 'Statistical Analysis', 'Big Data Technologies (Spark)', 'Data Storytelling'],
    relevantStreams: ['Computer Science & Engineering', 'Statistics', 'Mathematics', 'Data Science', 'Economics'],
    resources: [{ name: 'Coursera: IBM Data Science Professional Certificate', url: '#' }]
  },
  {
    id: 'data_analyst',
    title: 'Data Analyst',
    description: 'Analyze data to identify trends, create visualizations, and provide insights that help businesses make better decisions.',
    fitScore: 88,
    explanation: 'Your interest in problem-solving and logical thinking aligns well with the analytical nature of this role.',
    missingSkills: ['Advanced SQL', 'Tableau/Power BI', 'Python (Pandas, NumPy)'],
    totalSkills: ['SQL', 'Advanced SQL', 'Excel', 'Statistics', 'Tableau/Power BI', 'Python (Pandas, NumPy)', 'Communication'],
    relevantStreams: ['Computer Science & Engineering', 'Information Technology (IT)', 'Statistics', 'Mathematics', 'Economics', 'Business Analytics', 'Computer Applications (BCA)'],
    resources: [
      { name: 'NPTEL: Data Science for Engineers', url: '#' },
      { name: 'Coursera: Google Data Analytics Certificate', url: '#' },
    ]
  },
  {
    id: 'cybersecurity_specialist',
    title: 'Cybersecurity Specialist',
    description: "Protect an organization's computer networks and systems by identifying and mitigating cybersecurity threats.",
    fitScore: 86,
    explanation: 'Your attention to detail and interest in security make you a strong candidate for protecting digital assets.',
    missingSkills: ['Network Security', 'Penetration Testing', 'SIEM Tools (Splunk)'],
    totalSkills: ['Cybersecurity Principles', 'Network Security', 'Penetration Testing', 'SIEM Tools (Splunk)', 'Incident Response', 'Cryptography', 'Risk Assessment'],
    relevantStreams: ['Computer Science & Engineering', 'Information Technology (IT)', 'Cybersecurity'],
    resources: [{ name: 'CompTIA Security+ Certification', url: '#' }]
  },
  {
    id: 'cloud_engineer',
    title: 'Cloud Engineer / Architect',
    description: 'Design, implement, and manage cloud-based infrastructure and services on platforms like AWS, Azure, or Google Cloud.',
    fitScore: 80,
    explanation: 'Your interest in systems and infrastructure is perfect for a high-demand career in cloud computing.',
    missingSkills: ['AWS/Azure/GCP Fundamentals', 'Infrastructure as Code (Terraform)', 'CI/CD Pipelines'],
    totalSkills: ['Linux Administration', 'Networking', 'AWS/Azure/GCP Fundamentals', 'Docker & Kubernetes', 'Infrastructure as Code (Terraform)', 'CI/CD Pipelines', 'Scripting (Bash/Python)'],
    relevantStreams: ['Computer Science & Engineering', 'Information Technology (IT)', 'Electronics & Communication Engineering (ECE)', 'Electrical & Electronics Engineering (EEE)'],
    resources: [{ name: 'Coursera: Google IT Automation with Python', url: '#' }]
  },
  {
    id: 'devops_engineer',
    title: 'DevOps Engineer',
    description: 'Automate and streamline the software development lifecycle, from building and testing to deployment and operations.',
    fitScore: 82,
    explanation: 'Your interest in automation and system efficiency makes you a great fit for the collaborative world of DevOps.',
    missingSkills: ['CI/CD (Jenkins/GitHub Actions)', 'Container Orchestration (Kubernetes)', 'Infrastructure as Code (Terraform)'],
    totalSkills: ['Linux/Shell Scripting', 'CI/CD (Jenkins/GitHub Actions)', 'Docker', 'Container Orchestration (Kubernetes)', 'Infrastructure as Code (Terraform)', 'Cloud Platforms (AWS/Azure/GCP)', 'Monitoring Tools (Prometheus)'],
    relevantStreams: ['Computer Science & Engineering', 'Information Technology (IT)', 'Electronics & Communication Engineering (ECE)'],
    resources: [{ name: 'KodeKloud - DevOps Training', url: '#' }]
  },
  {
    id: 'blockchain_dev',
    title: 'Blockchain Developer',
    description: 'Design, implement, and support distributed blockchain networks and applications, including smart contracts and protocols.',
    fitScore: 78,
    explanation: 'Your interest in decentralized systems and cryptography is perfect for this cutting-edge field.',
    missingSkills: ['Solidity', 'Web3.js / Ethers.js', 'Smart Contract Development'],
    totalSkills: ['Data Structures & Algorithms', 'Cryptography', 'Solidity', 'Web3.js / Ethers.js', 'Smart Contract Development', 'Truffle/Hardhat', 'IPFS'],
    relevantStreams: ['Computer Science & Engineering', 'Information Technology (IT)', 'Cybersecurity'],
    resources: [{ name: 'CryptoZombies - Learn to Code Blockchain DApps', url: '#' }]
  },
  {
    id: 'ui_ux_designer',
    title: 'UI/UX Designer',
    description: 'Design intuitive, accessible, and aesthetically pleasing user interfaces for websites and applications, focusing on user research and experience.',
    fitScore: 78,
    explanation: 'Your creativity and empathy for users are the perfect combination for a career in UI/UX design.',
    missingSkills: ['Figma/Adobe XD', 'User Research Methods', 'Wireframing & Prototyping'],
    totalSkills: ['Figma/Adobe XD', 'User Research Methods', 'Wireframing & Prototyping', 'Usability Testing', 'Design Systems', 'Visual Design Principles', 'Interaction Design'],
    relevantStreams: ['Design (Fashion, Interior, Product)', 'Fine Arts (BFA)', 'Communication & Journalism', 'Psychology', 'Computer Applications (BCA)', 'Any'],
    resources: [{ name: 'Google UX Design Professional Certificate', url: '#' }]
  },

  // --- Healthcare & Life Sciences ---
  {
    id: 'physician_doctor',
    title: 'Physician / Doctor',
    description: 'Diagnose and treat human diseases, injuries, and other physical and mental impairments. Specialize in various fields like cardiology or pediatrics.',
    fitScore: 85,
    explanation: 'Your dedication, scientific aptitude, and compassion are essential qualities for a successful medical career.',
    missingSkills: ['Clinical Rotations Experience', 'Specialized Medical Knowledge', 'Patient Counseling'],
    totalSkills: ['Medical Diagnosis', 'Anatomy & Physiology', 'Pharmacology', 'Patient Care', 'Clinical Rotations Experience', 'Specialized Medical Knowledge', 'Patient Counseling'],
    relevantStreams: ['Medicine & Surgery (MBBS)'],
    resources: [{ name: 'NEET-PG Preparation Resources', url: '#' }]
  },
  {
    id: 'nurse_practitioner',
    title: 'Nurse Practitioner',
    description: 'Provide advanced nursing care, diagnose and treat illnesses, and manage patient health, often specializing in areas like family health.',
    fitScore: 81,
    explanation: 'Your empathy and scientific aptitude are key strengths for a fulfilling career in advanced healthcare.',
    missingSkills: ['Advanced Diagnostics', 'Pharmacology', 'Patient Management'],
    totalSkills: ['Patient Assessment', 'Clinical Diagnosis', 'Advanced Diagnostics', 'Pharmacology', 'Patient Management', 'Healthcare Regulations', 'Empathy'],
    relevantStreams: ['Nursing', 'Medicine & Surgery (MBBS)', 'Biology'],
    resources: [{ name: 'Indian Nursing Council Resources', url: '#' }]
  },
  {
    id: 'biotech_scientist',
    title: 'Biotech Scientist / Researcher',
    description: 'Conduct research and experiments in cellular and molecular biology to develop new products and technologies in medicine and agriculture.',
    fitScore: 84,
    explanation: 'Your inquisitive nature and strong foundation in biology are perfect for a career in biotechnological innovation.',
    missingSkills: ['PCR & Gene Sequencing', 'Cell Culture Techniques', 'Bioinformatics'],
    totalSkills: ['Molecular Biology', 'Genetics', 'PCR & Gene Sequencing', 'Cell Culture Techniques', 'Bioinformatics', 'Statistical Analysis', 'Lab Documentation'],
    relevantStreams: ['Biotechnology Engineering', 'Biotechnology', 'Biochemistry', 'Microbiology', 'Genetics'],
    resources: [{ name: 'NPTEL: Introduction to Modern Biology', url: '#' }]
  },
  {
    id: 'pharmacist',
    title: 'Pharmacist',
    description: 'Dispense prescription medications to patients and offer expertise in the safe use of prescriptions. Also may conduct research or work in hospital settings.',
    fitScore: 80,
    explanation: 'Your attention to detail and knowledge of chemistry make you well-suited to the vital role of a pharmacist.',
    missingSkills: ['Pharmacology', 'Pharmaceutical Law & Ethics', 'Patient Counseling'],
    totalSkills: ['Chemistry', 'Pharmacology', 'Pharmaceutical Law & Ethics', 'Patient Counseling', 'Inventory Management', 'Medical Terminology'],
    relevantStreams: ['Pharmacy (B.Pharm)'],
    resources: [{ name: 'GPAT Examination Resources', url: '#' }]
  },
  {
    id: 'public_health_specialist',
    title: 'Public Health Specialist',
    description: 'Work to improve community health outcomes by promoting healthy practices, conducting research, and analyzing health data.',
    fitScore: 79,
    explanation: 'Your passion for community well-being and analytical skills can drive significant positive change in public health.',
    missingSkills: ['Epidemiology', 'Health Policy Analysis', 'Community Outreach'],
    totalSkills: ['Epidemiology', 'Biostatistics', 'Health Policy Analysis', 'Community Outreach', 'Grant Writing', 'Data Analysis'],
    relevantStreams: ['Public Health', 'Social Work', 'Sociology', 'Medicine & Surgery (MBBS)', 'Nursing'],
    resources: [{ name: 'SWAYAM: Introduction to Public Health', url: '#' }]
  },
   
  // --- Business & Finance ---
  {
    id: 'business_analyst',
    title: 'Business Analyst',
    description: 'Bridge the gap between business needs and technology solutions by gathering requirements, analyzing processes, and documenting specifications.',
    fitScore: 84,
    explanation: 'Your analytical skills and ability to understand both business and technical concepts are perfect for this role.',
    missingSkills: ['Requirements Gathering', 'Business Process Modeling (BPMN)', 'SQL for analysis'],
    totalSkills: ['Requirements Gathering', 'Business Process Modeling (BPMN)', 'SQL for analysis', 'Data Analysis', 'Stakeholder Communication', 'Agile Methodologies', 'Documentation'],
    relevantStreams: ['Business Administration (BBA)', 'Information Technology (IT)', 'Computer Science & Engineering', 'Economics', 'Commerce (B.Com)', 'Business Analytics'],
    resources: [{ name: 'IIBA: Entry Certificate in Business Analysis (ECBA)', url: '#' }]
  },
  {
    id: 'product_manager',
    title: 'Associate Product Manager',
    description: 'Work with cross-functional teams to design, build, and launch products that meet user needs and business goals.',
    fitScore: 75,
    explanation: 'Your communication skills and goal-oriented mindset are key strengths for a product management career.',
    missingSkills: ['Agile/Scrum Methodologies', 'User Story Writing', 'Market Research'],
    totalSkills: ['Communication', 'Agile/Scrum Methodologies', 'User Story Writing', 'Market Research', 'Roadmapping', 'Data Analysis'],
    relevantStreams: ['Business Administration (BBA)', 'Marketing', 'Economics', 'Computer Science & Engineering', 'Any'],
    resources: [{ name: 'Udemy: Become a Product Manager', url: '#' }]
  },
  {
    id: 'financial_analyst',
    title: 'Financial Analyst',
    description: 'Analyze financial data to help companies make investment decisions. Prepare reports, models, and forecasts on stocks, bonds, and industries.',
    fitScore: 86,
    explanation: 'Your strong quantitative skills and interest in markets make you a natural fit for financial analysis.',
    missingSkills: ['Financial Modeling', 'Valuation Techniques', 'Advanced Excel'],
    totalSkills: ['Accounting', 'Financial Modeling', 'Valuation Techniques', 'Advanced Excel', 'Statistics', 'Corporate Finance', 'Communication'],
    relevantStreams: ['Commerce (B.Com)', 'Economics', 'Finance', 'Business Administration (BBA)', 'Accounting & Finance'],
    resources: [{ name: 'CFA Institute Investment Foundations', url: '#' }]
  },
  {
    id: 'chartered_accountant',
    title: 'Chartered Accountant (CA)',
    description: 'Manage finances, auditing, taxation, and financial reporting for businesses and individuals.',
    fitScore: 88,
    explanation: 'Your meticulous nature and expertise in finance and law are perfect for a prestigious career as a CA.',
    missingSkills: ['Auditing Standards', 'Direct & Indirect Taxation', 'Corporate Law'],
    totalSkills: ['Accounting Principles', 'Auditing Standards', 'Direct & Indirect Taxation', 'Corporate Law', 'Financial Management', 'Cost Accounting'],
    relevantStreams: ['Commerce (B.Com)', 'Accounting & Finance'],
    resources: [{ name: 'ICAI - The Institute of Chartered Accountants of India', url: '#' }]
  },
  {
    id: 'management_consultant',
    title: 'Management Consultant',
    description: 'Help organizations solve problems, improve performance, and create value by providing objective advice and implementing business solutions.',
    fitScore: 83,
    explanation: 'Your problem-solving abilities and strong communication skills are highly valued in the consulting industry.',
    missingSkills: ['Case Study Analysis', 'Data Interpretation', 'Client Presentation'],
    totalSkills: ['Problem-Solving', 'Case Study Analysis', 'Data Interpretation', 'Client Presentation', 'Project Management', 'Market Research', 'Teamwork'],
    relevantStreams: ['Business Administration (BBA)', 'Economics', 'Engineering (All Streams)', 'Any'],
    resources: [{ name: 'CaseInterview.com', url: '#' }]
  },
  {
    id: 'digital_marketing',
    title: 'Digital Marketing Specialist',
    description: 'Develop and execute online marketing campaigns using SEO, SEM, social media, and email to grow a company\'s digital presence.',
    fitScore: 76,
    explanation: 'Your communication skills and analytical mindset are ideal for driving growth through digital marketing.',
    missingSkills: ['Google Analytics', 'SEO/SEM Strategy', 'Content Marketing'],
    totalSkills: ['Google Analytics', 'SEO/SEM Strategy', 'Content Marketing', 'Social Media Management', 'Email Marketing', 'Data Analysis', 'Copywriting'],
    relevantStreams: ['Business Administration (BBA)', 'Marketing', 'Communication & Journalism', 'Arts (B.A.)', 'Any'],
    resources: [{ name: 'HubSpot Academy: Inbound Marketing', url: '#' }]
  },

  // --- Engineering & Core Industries ---
  {
    id: 'mechanical_engineer',
    title: 'Mechanical Engineer',
    description: 'Design, develop, build, and test mechanical devices, including tools, engines, and machines.',
    fitScore: 80,
    explanation: 'Your aptitude for physics and design is perfect for creating tangible solutions to real-world problems.',
    missingSkills: ['CAD Software (AutoCAD/SolidWorks)', 'Thermodynamics', 'Finite Element Analysis (FEA)'],
    totalSkills: ['CAD Software (AutoCAD/SolidWorks)', 'Thermodynamics', 'Finite Element Analysis (FEA)', 'Fluid Mechanics', 'Manufacturing Processes', 'Material Science'],
    relevantStreams: ['Mechanical Engineering', 'Mechatronics Engineering', 'Automobile Engineering'],
    resources: [{ name: 'NPTEL: Engineering Mechanics', url: '#' }]
  },
  {
    id: 'civil_engineer',
    title: 'Civil Engineer',
    description: 'Design, build, and maintain infrastructure projects in the public and private sector, including roads, buildings, airports, and bridges.',
    fitScore: 79,
    explanation: 'Your interest in large-scale projects and structural design can help you build the world of tomorrow.',
    missingSkills: ['AutoCAD & Civil 3D', 'Structural Analysis', 'Project Management'],
    totalSkills: ['AutoCAD & Civil 3D', 'Structural Analysis', 'Project Management', 'Geotechnical Engineering', 'Surveying', 'Construction Management'],
    relevantStreams: ['Civil Engineering', 'Structural Engineering', 'Architecture (B.Arch)'],
    resources: [{ name: 'Coursera: Construction Management Specialization', url: '#' }]
  },
  {
    id: 'electrical_engineer',
    title: 'Electrical Engineer',
    description: 'Design, develop, test, and supervise the manufacturing of electrical equipment, such as electric motors, radar, and navigation systems.',
    fitScore: 81,
    explanation: 'Your fascination with circuits and electricity is ideal for powering innovation in countless industries.',
    missingSkills: ['Circuit Design & Analysis', 'Control Systems', 'Embedded Systems (Microcontrollers)'],
    totalSkills: ['Circuit Design & Analysis', 'Control Systems', 'Embedded Systems (Microcontrollers)', 'Power Systems', 'Signal Processing', 'MATLAB/Simulink'],
    relevantStreams: ['Electrical & Electronics Engineering (EEE)', 'Electronics & Communication Engineering (ECE)', 'Instrumentation & Control Engineering'],
    resources: [{ name: 'NPTEL: Basic Electrical Circuits', url: '#' }]
  },
  {
    id: 'robotics_engineer',
    title: 'Robotics Engineer',
    description: 'Design, build, and program robots and automated systems to perform tasks that are difficult or dangerous for humans.',
    fitScore: 85,
    explanation: 'Your blend of mechanical, electrical, and software skills is perfect for the exciting field of robotics.',
    missingSkills: ['Robot Operating System (ROS)', 'Kinematics & Dynamics', 'Computer Vision'],
    totalSkills: ['C++/Python', 'Robot Operating System (ROS)', 'Kinematics & Dynamics', 'Computer Vision', 'Control Theory', 'Mechatronics'],
    relevantStreams: ['Mechatronics Engineering', 'Mechanical Engineering', 'Electrical & Electronics Engineering (EEE)', 'Computer Science & Engineering'],
    resources: [{ name: 'Coursera: Modern Robotics Specialization', url: '#' }]
  },
  {
    id: 'aerospace_engineer',
    title: 'Aerospace Engineer',
    description: 'Design and build aircraft, spacecraft, satellites, and missiles. Specialize in areas like aerodynamics, propulsion, and avionics.',
    fitScore: 82,
    explanation: 'Your passion for flight and complex systems can lead to a high-flying career in aerospace.',
    missingSkills: ['Aerodynamics', 'Propulsion Systems', 'CFD Software (ANSYS)'],
    totalSkills: ['Aerodynamics', 'Propulsion Systems', 'CFD Software (ANSYS)', 'Thermodynamics', 'Structural Analysis', 'Flight Mechanics'],
    relevantStreams: ['Aerospace Engineering', 'Aeronautical Engineering', 'Mechanical Engineering'],
    resources: [{ name: 'MIT OpenCourseWare: Unified Engineering', url: '#' }]
  },
  {
    id: 'automotive_engineer',
    title: 'Automotive Engineer (EV Focus)',
    description: 'Design, develop, and test vehicles and their components, with a growing focus on electric vehicles (EVs), battery technology, and autonomous systems.',
    fitScore: 81,
    explanation: 'Your interest in cars and sustainable technology puts you in the driver\'s seat for the future of transportation.',
    missingSkills: ['EV Battery Technology', 'CAN bus protocol', 'Automotive Embedded Systems'],
    totalSkills: ['CAD (CATIA/SolidWorks)', 'EV Battery Technology', 'CAN bus protocol', 'Automotive Embedded Systems', 'Vehicle Dynamics', 'Thermodynamics'],
    relevantStreams: ['Automobile Engineering', 'Mechanical Engineering', 'Electrical & Electronics Engineering (EEE)'],
    resources: [{ name: 'NPTEL: Electric Vehicles', url: '#' }]
  },
  
  // --- Sustainability & Energy ---
  {
    id: 'enviro_engineer',
    title: 'Environmental Engineer',
    description: 'Apply engineering principles to improve environmental conditions, focusing on waste management, pollution control, and sustainability.',
    fitScore: 78,
    explanation: 'Your interest in sustainability and engineering can be combined to make a real-world impact.',
    missingSkills: ['Environmental Regulations', 'Waste Management Systems', 'GIS Software'],
    totalSkills: ['Environmental Science', 'Chemistry', 'Fluid Mechanics', 'Environmental Regulations', 'Waste Management Systems', 'GIS Software', 'Project Management'],
    relevantStreams: ['Environmental Engineering', 'Civil Engineering', 'Chemical Engineering', 'Biotechnology Engineering'],
    resources: [{ name: 'NPTEL: Environmental Engineering', url: '#' }]
  },
  {
    id: 'renewable_energy_spec',
    title: 'Renewable Energy Specialist',
    description: 'Design, develop, and manage projects related to renewable energy sources like solar, wind, and hydropower.',
    fitScore: 79,
    explanation: 'Your passion for clean energy and technical skills are perfect for this growing field.',
    missingSkills: ['Solar Panel Technology', 'Energy Modeling Software', 'Grid Integration'],
    totalSkills: ['Physics', 'Electrical Engineering', 'Solar Panel Technology', 'Wind Turbine Technology', 'Energy Modeling Software', 'Grid Integration', 'Policy Analysis'],
    relevantStreams: ['Electrical & Electronics Engineering (EEE)', 'Mechanical Engineering', 'Energy Engineering', 'Environmental Science'],
    resources: [{ name: 'Coursera: Renewable Energy and Green Building Entrepreneurship', url: '#' }]
  },
  {
    id: 'sustainability_consultant',
    title: 'Sustainability Consultant',
    description: 'Advise organizations on how to improve their environmental and social impact, focusing on strategy, regulations, and reporting.',
    fitScore: 77,
    explanation: 'Your passion for the environment and strategic thinking can help businesses become more sustainable.',
    missingSkills: ['ESG Frameworks (GRI, SASB)', 'Life Cycle Assessment (LCA)', 'Corporate Sustainability Strategy'],
    totalSkills: ['Environmental Science', 'ESG Frameworks (GRI, SASB)', 'Life Cycle Assessment (LCA)', 'Corporate Sustainability Strategy', 'Data Analysis', 'Stakeholder Engagement'],
    relevantStreams: ['Environmental Science', 'Business Administration (BBA)', 'Economics', 'Environmental Engineering'],
    resources: [{ name: 'Coursera: Corporate Sustainability', url: '#' }]
  },

  // --- Emerging Fields ---
  {
    id: 'ar_vr_developer',
    title: 'AR/VR Developer',
    description: 'Create immersive augmented reality (AR) and virtual reality (VR) experiences using game engines and 3D modeling.',
    fitScore: 80,
    explanation: 'Your blend of creativity and programming skills is perfect for building the next generation of digital experiences.',
    missingSkills: ['Unity or Unreal Engine', '3D Modeling (Blender)', 'C# or C++'],
    totalSkills: ['Unity or Unreal Engine', '3D Modeling (Blender)', 'C# or C++', 'Computer Graphics Principles', 'UI/UX for 3D', 'Performance Optimization'],
    relevantStreams: ['Computer Science & Engineering', 'Game Development', 'Animation & Multimedia'],
    resources: [{ name: 'Unity Learn Platform', url: '#' }]
  },
  {
    id: 'edtech_specialist',
    title: 'EdTech Specialist',
    description: 'Design and develop technology-based learning solutions, including learning management systems (LMS), interactive content, and educational apps.',
    fitScore: 78,
    explanation: 'Your passion for education and technology can help shape the future of learning.',
    missingSkills: ['Instructional Design', 'LMS Administration (Moodle/Canvas)', 'E-learning Authoring Tools (Articulate Storyline)'],
    totalSkills: ['Instructional Design', 'LMS Administration (Moodle/Canvas)', 'E-learning Authoring Tools (Articulate Storyline)', 'Video Editing', 'Learning Analytics', 'Web Development Basics'],
    relevantStreams: ['Education (B.Ed.)', 'Computer Science & Engineering', 'Communication & Journalism', 'Psychology'],
    resources: [{ name: 'ATD: Instructional Design Certificate', url: '#' }]
  },

  // --- Logistics & Other ---
  {
    id: 'logistics_specialist',
    title: 'Logistics Specialist',
    description: 'Coordinate and manage the entire lifecycle of a product, including acquisition, distribution, allocation, and delivery.',
    fitScore: 83,
    explanation: 'Your organizational skills and ability to see the big picture are perfect for managing complex supply chains.',
    missingSkills: ['Supply Chain Management Software', 'Inventory Control', 'Route Optimization'],
    totalSkills: ['Supply Chain Management Software', 'Inventory Control', 'Route Optimization', 'Data Analysis', 'Vendor Management', 'Forecasting'],
    relevantStreams: ['Supply Chain & Logistics', 'Business Administration (BBA)', 'Industrial Engineering', 'Operations Management'],
    resources: [{ name: 'APICS Certified in Logistics, Transportation and Distribution (CLTD)', url: '#' }]
  },
];


// FIX: Corrected the type to be an array of roadmap week objects. The previous type was for a single object, but the data is an array of weeks for each role.
export const ROADMAP_DATA: Record<string, (Omit<RoadmapWeek, 'goals'> & { goals: Omit<RoadmapWeek['goals'][0], 'completed'>[] })[]> = {
  'data_analyst': [
    { week: 1, title: 'SQL Fundamentals', goals: [{text: 'Learn SELECT, FROM, WHERE, GROUP BY'}, {text: 'Practice basic queries on HackerRank'}] },
    { week: 2, title: 'Advanced SQL', goals: [{text: 'Master JOINs and subqueries'}, {text: 'Learn about window functions'}] },
    { week: 3, title: 'Intro to Python for Data', goals: [{text: 'Setup Python environment (Anaconda)'}, {text: 'Learn Pandas DataFrames'}] },
    { week: 4, title: 'Data Visualization', goals: [{text: 'Create first dashboard in Tableau Public'}, {text: 'Learn principles of effective visualization'}] },
  ],
  'frontend_dev': [
    { week: 1, title: 'HTML & CSS Mastery', goals: [{text: 'Build a personal portfolio page'}, {text: 'Understand Flexbox and Grid'}] },
    { week: 2, title: 'JavaScript Basics', goals: [{text: 'Learn about variables, functions, and loops'}, {text: 'Manipulate the DOM'}] },
    { week: 3, title: 'React Fundamentals', goals: [{text: 'Create a simple React app (CRA)'}, {text: 'Learn about components, props, and state'}] },
    { week: 4, title: 'Advanced React', goals: [{text: 'Understand React Hooks (useState, useEffect)'}, {text: 'Build a small project like a to-do list'}] },
  ],
  'backend_dev': [
    { week: 1, title: 'Programming Language & Git', goals: [{text: 'Master basics of Python/Node.js'}, {text: 'Learn Git commands (commit, push, pull, branch)'}] },
    { week: 2, title: 'Framework & API Basics', goals: [{text: 'Build a simple "Hello World" API with Express/Django'}, {text: 'Understand RESTful principles'}] },
    { week: 3, title: 'Database Fundamentals', goals: [{text: 'Learn basic SQL (CRUD operations)'}, {text: 'Connect your API to a PostgreSQL database'}] },
    { week: 4, title: 'Authentication', goals: [{text: 'Implement basic user signup and login'}, {text: 'Learn about JWTs for securing endpoints'}] },
  ],
  'cloud_engineer': [
    { week: 1, title: 'Cloud & Linux Basics', goals: [{text: 'Create an AWS Free Tier account'}, {text: 'Learn basic Linux commands (ls, cd, pwd, grep)'}] },
    { week: 2, title: 'Core Cloud Services', goals: [{text: 'Launch an EC2 instance on AWS'}, {text: 'Understand S3 for object storage'}] },
    { week: 3, title: 'Introduction to Docker', goals: [{text: 'Write a Dockerfile for a simple app'}, {text: 'Build and run your first container'}] },
    { week: 4, title: 'Networking Fundamentals', goals: [{text: 'Understand VPC, Subnets, and Security Groups'}, {text: 'Setup a basic network in the cloud'}] },
  ],
  'product_manager': [
    { week: 1, title: 'Product Management Basics', goals: [{text: 'Read "Inspired" by Marty Cagan'}, {text: 'Understand the product lifecycle'}] },
    { week: 2, title: 'User Research', goals: [{text: 'Learn how to conduct user interviews'}, {text: 'Create a user persona for a sample app'}] },
  ]
};

export const MOCK_INTERVIEW_RESPONSES: string[] = [
    "That's an interesting way to put it. Can you elaborate on the challenges you faced in that project?",
    "Good. Now, how would you handle a situation where a key stakeholder disagrees with your technical approach?",
    "Let's switch gears. Tell me about a time you had to learn a new technology quickly.",
    "Okay, thank you. What questions do you have for me?",
    "Describe a project you are proud of. What was your specific contribution?"
];

export const RESUME_FEEDBACK = {
    strengths: "Your resume clearly outlines your educational background and lists your technical skills effectively.",
    improvements: "The project descriptions could be more action-oriented. Use the STAR (Situation, Task, Action, Result) method to showcase impact. Quantify your achievements where possible (e.g., 'improved performance by 15%').",
    points: [
        "Spearheaded the development of a responsive e-commerce front-end using React, resulting in a 20% increase in user engagement.",
        "Engineered a RESTful API with Node.js and Express for a university portal, handling over 1000 daily requests.",
        "Automated data cleaning tasks using Python scripts, reducing manual processing time by 4 hours per week."
    ]
};

export const INTERVIEW_SUMMARY = {
    strengths: "You provided clear and structured answers, especially when describing your past projects. You successfully used the STAR method to frame your responses, which was very effective.",
    improvements: "Consider providing more specific, quantifiable results of your actions. When asked about handling disagreements, try to elaborate on the communication and negotiation skills you used to reach a resolution."
};

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

export const JOB_LISTINGS_DATA: JobListing[] = [
    { id: 'job1', title: 'Data Analyst Intern', company: 'Swiggy', location: 'Bengaluru', experience: 'Internship', requiredSkills: ['SQL', 'Excel', 'Statistics'], link: '#', companySize: 'Large', industry: 'E-commerce', postedDate: d(2), workStyle: 'On-site', relevantStreams: ['Computer Science', 'Statistics', 'Mathematics'] },
    { id: 'job2', title: 'Jr. Frontend Developer', company: 'Zomato', location: 'Gurugram', experience: '0-1 Years', requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React.js / Next.js'], link: '#', companySize: 'Large', industry: 'E-commerce', postedDate: d(5), workStyle: 'Hybrid', relevantStreams: ['Computer Science', 'IT'] },
    { id: 'job3', title: 'Data Analyst', company: 'Paytm', location: 'Noida', experience: '0-1 Years', requiredSkills: ['SQL', 'Advanced SQL', 'Tableau/Power BI', 'Excel'], link: '#', companySize: 'Large', industry: 'FinTech', postedDate: d(10), workStyle: 'On-site', relevantStreams: ['Computer Science', 'Statistics'] },
    { id: 'job4', title: 'React Developer', company: 'Razorpay', location: 'Remote', experience: '2+ Years', requiredSkills: ['React.js / Next.js', 'TypeScript', 'State Management (Redux/Context)', 'Git'], link: '#', companySize: 'Mid-Size', industry: 'FinTech', postedDate: d(1), workStyle: 'Remote', relevantStreams: ['Computer Science', 'IT'] },
    { id: 'job5', title: 'Associate Product Manager', company: 'PhonePe', location: 'Bengaluru', experience: '0-1 Years', requiredSkills: ['Communication', 'Data Analysis', 'User Story Writing'], link: '#', companySize: 'Mid-Size', industry: 'FinTech', postedDate: d(15), workStyle: 'On-site', relevantStreams: ['Business', 'Computer Science', 'Any'] },
    { id: 'job6', title: 'Frontend Engineer', company: 'CRED', location: 'Remote', experience: '2+ Years', requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React.js / Next.js', 'TypeScript', 'Responsive Design'], link: '#', companySize: 'Mid-Size', industry: 'FinTech', postedDate: d(3), workStyle: 'Remote', relevantStreams: ['Computer Science', 'IT'] },
    { id: 'job7', title: 'SDE-1', company: 'Tech Startup', location: 'Pune', experience: '0-1 Years', requiredSkills: ['JavaScript', 'Node.js', 'React.js / Next.js'], link: '#', companySize: 'Startup', industry: 'SaaS', postedDate: d(8), workStyle: 'On-site', relevantStreams: ['Computer Science'] },
    { id: 'job8', title: 'Data Science Intern', company: 'Health AI', location: 'Remote', experience: 'Internship', requiredSkills: ['Python (Pandas, NumPy)', 'Statistics'], link: '#', companySize: 'Startup', industry: 'Healthcare', postedDate: d(4), workStyle: 'Remote', relevantStreams: ['Statistics', 'Data Science', 'Computer Science'] }
];

export const ASSESSMENTS_DATA: Assessment[] = [
    {
        id: 'sql_adv_1',
        title: 'Advanced SQL Quiz',
        skill: 'Advanced SQL',
        questions: [
            { id: 'q1', question: 'Which of the following is NOT a type of SQL JOIN?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN', 'OUTER JOIN'], answer: 'OUTER JOIN' },
            { id: 'q2', question: 'What is a window function in SQL?', options: ['A function that operates on a set of rows and returns a single value for each row from the underlying query.', 'A function that groups rows that have the same values into summary rows.', 'A function that combines the result-set of two or more SELECT statements.'], answer: 'A function that operates on a set of rows and returns a single value for each row from the underlying query.' },
            { id: 'q3', question: 'What does CTE stand for in SQL?', options: ['Common Table Expression', 'Column Table Entry', 'Continuous Table Evaluation'], answer: 'Common Table Expression' },
        ],
    },
    {
        id: 'react_fund_1',
        title: 'React Fundamentals',
        skill: 'React.js / Next.js',
        questions: [
            { id: 'q1', question: 'What is JSX?', options: ['A JavaScript library for building user interfaces', 'A syntax extension for JavaScript', 'A state management library'], answer: 'A syntax extension for JavaScript' },
            { id: 'q2', question: 'Which hook is used to manage state in a functional component?', options: ['useEffect', 'useState', 'useContext'], answer: 'useState' },
            { id: 'q3', question: 'How do you pass data from a parent component to a child component?', options: ['State', 'Context', 'Props'], answer: 'Props' },
            { id: 'q4', question: 'What is the purpose of the `key` prop in a list of elements?', options: ['To give the element a unique CSS style', 'To help React identify which items have changed, are added, or are removed', 'To set the component\'s state'], answer: 'To help React identify which items have changed, are added, or are removed' },
        ],
    },
    {
        id: 'python_data_1',
        title: 'Python for Data Analysis',
        skill: 'Python (Pandas, NumPy)',
        questions: [], // AI will generate
    },
    {
        id: 'db_manage_1',
        title: 'Database Management Concepts',
        skill: 'Database Management (SQL/NoSQL)',
        questions: [], // AI will generate
    },
    {
        id: 'agile_scrum_1',
        title: 'Agile & Scrum Fundamentals',
        skill: 'Agile/Scrum Methodologies',
        questions: [], // AI will generate
    },
    {
        id: 'cicd_1',
        title: 'CI/CD Concepts',
        skill: 'CI/CD (Jenkins/GitHub Actions)',
        questions: [], // AI will generate
    },
    {
        id: 'net_sec_1',
        title: 'Network Security Basics',
        skill: 'Network Security',
        questions: [], // AI will generate
    },
    {
        id: 'python_basics_1',
        title: 'Python Basics',
        skill: 'Python',
        questions: [], // AI will generate
    },
];