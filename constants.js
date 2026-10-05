// constants.js — single source of truth for all site data (PRD §1.5, §5.2, §5.4, §5.5)
// PageTab = 'home' | 'profile' | 'education' | 'projects' | 'certificates'
//          | 'achievements' | 'experience' | 'contact' | '404'
// Project  = { id:number, title:string, category:string, year:string,
//              image:string, description:string, link?:string }
// NavItem  = { label:string, href:string }
// ChatMessage = { role:'user'|'model', text:string }
// SkillData = { subject:string, A:number, fullMark:number }

export const CONTACT = {
  name: 'Ryan George Koickal',
  email: 'Rg05.koickal@gmail.com', // capital R, capital g — do not correct
  github: 'https://github.com/ryan1234814/',
  linkedin: 'https://linkedin.com/in/ryan-george-1a6161283/',
  linkedinCerts: 'https://linkedin.com/in/ryan-george-1a6161283/details/certifications/',
  huggingface: 'https://huggingface.co/coder1969',
  location: 'Kakkanad, Ernakulam, Kerala, India',
  footerLocation: 'Kerala, India',
  brikcode: 'https://ai.studio/apps/3c9652a3-b4d9-48f8-aa1c-600c66c77716',
  year: 2026,
};

export const NAV_ITEMS = [
  { tab: 'home', label: 'Home' },
  { tab: 'profile', label: 'Profile' },
  { tab: 'education', label: 'Education' },
  { tab: 'projects', label: 'Projects' },
  { tab: 'certificates', label: 'Certificates' },
  { tab: 'achievements', label: 'Achievements' },
  { tab: 'experience', label: 'Experience' },
  { tab: 'contact', label: 'Contact' },
];

// Tab sequence drives transition direction and the mobile "next" pull target.
export const TAB_SEQUENCE = ['home', 'profile', 'education', 'projects', 'certificates', 'achievements', 'experience', 'contact'];

export const TAB_LABELS = {
  home: 'Home',
  profile: 'Profile',
  education: 'Education',
  projects: 'Projects',
  certificates: 'Certificates',
  achievements: 'Achievements',
  experience: 'Experience',
  contact: 'Contact',
};

export const SKILLS_DATA = [
  { subject: 'Python & AI', A: 96, fullMark: 100 },
  { subject: 'LLM & RAG', A: 94, fullMark: 100 },
  { subject: 'ML & NLP', A: 92, fullMark: 100 },
  { subject: 'Data Science', A: 90, fullMark: 100 },
  { subject: 'Backend APIs', A: 88, fullMark: 100 },
  { subject: 'React & JS', A: 85, fullMark: 100 },
  { subject: 'Databases', A: 86, fullMark: 100 },
  { subject: 'Cloud & Deploy', A: 82, fullMark: 100 },
  { subject: 'Edge AI', A: 89, fullMark: 100 },
];

export const PROJECTS = [
  {
    id: 1,
    title: 'Xplora Travel Agent',
    category: 'Multi-Agent AI',
    year: '2026',
    image: 'https://picsum.photos/800/600?grayscale&random=50',
    description: 'High-concurrency multi-agent LangGraph travel planner with 6 custom agents (Budget, Itinerary, Weather, etc.) and 7 live APIs generating layouts in under 30 seconds.',
    link: 'https://github.com/ryan1234814/',
  },
  {
    id: 2,
    title: 'ACP RAG Agent',
    category: 'Generative AI & RAG',
    year: '2026',
    image: 'https://picsum.photos/800/600?grayscale&random=10',
    description: 'Multi-agent documentation reasoning pipeline using Agent Communication Protocol (LangChain + CrewAI) with FAISS semantic search over academic PDFs.',
    link: 'https://github.com/ryan1234814/',
  },
  {
    id: 3,
    title: 'Digital Twin AQI Kerala',
    category: 'Data Science & ML',
    year: '2026',
    image: 'https://picsum.photos/800/600?grayscale&random=60',
    description: 'Real-time AQI indexing and 24-hour prediction across 12 Kerala stations using physics-guided Random Forest/XGBoost trained on CAMS and ERA5 data.',
    link: 'https://github.com/ryan1234814/',
  },
  {
    id: 4,
    title: 'Edge-AI Bird Recognition',
    category: 'Edge AI & IoT',
    year: '2025',
    image: 'https://picsum.photos/800/600?grayscale&random=20',
    description: 'Offline Raspberry Pi bird recognition with BirdNET and USB microphone plus Gemini-generated species profiles and Streamlit analytics dashboard.',
    link: 'https://github.com/ryan1234814/',
  },
  {
    id: 5,
    title: 'Restaurant Review Intelligence',
    category: 'LLM Agents',
    year: '2025',
    image: 'https://picsum.photos/800/600?grayscale&random=30',
    description: 'Multi-model AI agents (Gemini & Groq) summarizing reviews and classifying OpenTable dishes, backed by scalable BeautifulSoup/Selenium pipelines.',
    link: 'https://github.com/ryan1234814/',
  },
];

export const EDUCATION_DATA = [
  {
    id: 'btech',
    degree: 'Bachelor of Technology (B.Tech)',
    field: 'Computer Science & Engineering (CSE)',
    institute: 'Rajagiri School of Engineering & Technology',
    location: 'Kakkanad, Ernakulam, Kerala',
    year: 'Sep 2023 — May 2027',
    level: 'Undergraduate Degree',
    metrics: [{ label: 'CGPA', value: '9.21 / 10.00', highlight: true }],
    featured: true,
  },
];

export const EXPERIENCES = [
  {
    id: 'iiit-kottayam',
    role: 'Research Intern',
    organization: 'IIIT Kottayam',
    collaboration: 'Edge-AI & Generative AI Research',
    type: 'Research Internship',
    duration: 'May 2025 – Jun 2025', // en dash with spaces — do not normalise
    location: 'Kottayam, Kerala, India',
    summary: 'Engineered an offline edge-AI bird recognition system on Raspberry Pi and linked generative AI for automated species profiling with an interactive analytics dashboard.',
    highlights: [
      'Edge-AI Classification: built offline bird recognition on Raspberry Pi using BirdNET and USB microphone for internet-independent audio classification in remote field environments.',
      'Generative AI Integration: linked Google Gemini API to generate instant natural-language species profiles covering habitat, behavior, and ecological relevance.',
      'Interactive Analytics: developed responsive Streamlit dashboard with real-time audio playback, spectrogram/waveform visualization, and educational summaries.',
    ],
    skills: ['BirdNET', 'Raspberry Pi', 'Google Gemini API', 'Streamlit', 'Edge-AI', 'Audio Classification'],
    featured: true,
    link: 'https://linkedin.com/in/ryan-george-1a6161283/',
  },
  {
    id: 'olcademy',
    role: 'Data Engineering Intern (Remote)',
    organization: 'Olcademy',
    collaboration: 'Data Pipelines & LLM Agents',
    type: 'Internship',
    duration: 'Mar 2025 – Sep 2025',
    location: 'Remote',
    summary: 'Built scalable web-scraping pipelines and multi-model LLM agents for restaurant intelligence, hardening pipeline reliability with checkpoint protocols.',
    highlights: [
      'Scalable Web Scraping: extracted large-scale restaurant metrics from RestaurantGuru via BeautifulSoup and Selenium pipelines, standardizing automated delivery to SharePoint.',
      'Intelligent LLM Agents: developed specialized multi-model AI agents (Gemini & Groq APIs) to summarize lengthy reviews and classify OpenTable dishes into dietary categories.',
      'Pipeline Infrastructure: refactored custom checkpoint-saving protocols, preventing data loss and ensuring continuous uninterrupted pipelines.',
    ],
    skills: ['BeautifulSoup', 'Selenium', 'SharePoint', 'Gemini API', 'Groq API', 'Python'],
    featured: true,
    link: 'https://linkedin.com/in/ryan-george-1a6161283/',
  },
];

export const ACHIEVEMENTS = [
  {
    id: 1,
    title: 'A Grade — English Essay Writing Competition',
    category: 'Literature & Communication',
    year: '2026',
    issuer: 'Bharatham 2026',
    highlight: 'A Grade',
    description: 'Secured an A Grade in the English Essay Writing competition at Bharatham 2026, demonstrating strong written communication and analytical expression.',
    imageUrl: null,
    link: null,
  },
  {
    id: 2,
    title: 'Official Website Development Contributions',
    category: 'Web Development',
    year: '2026',
    issuer: 'Confluence 3.0 • RSET IEDC',
    highlight: 'Production Websites',
    description: 'Contributed to the development of the official website of Confluence 3.0 and the RSET IEDC official website, delivering polished, responsive web experiences.',
    imageUrl: null,
    link: null,
  },
  {
    id: 3,
    title: 'Top 7 — CodeEdge Hackathon',
    category: 'Hackathon',
    year: '2026',
    issuer: 'ACM FISAT',
    highlight: 'Top 7',
    description: 'Secured a Top 7 position in the CodeEdge Hackathon conducted by ACM FISAT, competing against skilled teams across rapid prototyping and build challenges.',
    imageUrl: null,
    link: null,
  },
  {
    id: 4,
    title: 'NSOC 2026 — Open Source Contributions',
    category: 'Open Source',
    year: '2026',
    issuer: 'Nation Open Source Challenge',
    highlight: 'Rank 159/980',
    description: 'Secured rank 159/980 among NSOC 2026 open source project contributions, shipping verified pull requests across collaborative repositories.',
    imageUrl: 'achievements/nsoc-contributions.png',
    link: null,
  },
  {
    id: 5,
    title: 'Winner — BRIK Community Buildathon',
    category: 'Buildathon',
    year: '2026',
    issuer: 'BRIK Community',
    highlight: 'Buildathon Winner',
    description: "Won the BRIK Community's Buildathon by building BRIKCODE, a standout application delivered under competitive build constraints.",
    imageUrl: null,
    link: 'https://ai.studio/apps/3c9652a3-b4d9-48f8-aa1c-600c66c77716',
  },
];

export const CERTIFICATES = [
  {
    id: 1,
    title: 'Building AI Apps via RAG',
    issuer: 'Codecademy',
    year: '2025',
    field: 'Generative AI & RAG',
    skills: ['RAG', 'Vector Search', 'LLM Apps'],
    imageUrl: 'certificates/codecademy-rag.png',
    verifyUrl: null,
  },
  {
    id: 2,
    title: 'Deep Learning with TensorFlow',
    issuer: 'Codecademy',
    year: '2025',
    field: 'Deep Learning',
    skills: ['TensorFlow', 'Neural Networks', 'Model Training'],
    imageUrl: 'certificates/codecademy-tensorflow.png',
    verifyUrl: null,
  },
  {
    id: 3,
    title: 'Text Classification with PyTorch',
    issuer: 'Codecademy',
    year: '2025',
    field: 'NLP & PyTorch',
    skills: ['PyTorch', 'NLP', 'Classification'],
    imageUrl: 'certificates/codecademy-pytorch.png',
    verifyUrl: null,
  },
  {
    id: 4,
    title: 'Advanced Data Analysis with Python',
    issuer: 'Codecademy',
    year: '2025',
    field: 'Data Analysis',
    skills: ['Python', 'Pandas', 'NumPy'],
    imageUrl: 'certificates/codecademy-data-analysis.png',
    verifyUrl: null,
  },
  {
    id: 5,
    title: 'Machine Learning Model Architecture',
    issuer: 'Codecademy',
    year: '2025',
    field: 'Machine Learning',
    skills: ['Model Design', 'Evaluation', 'Scikit-learn'],
    imageUrl: 'certificates/codecademy-ml-architecture.png',
    verifyUrl: null,
  },
];
