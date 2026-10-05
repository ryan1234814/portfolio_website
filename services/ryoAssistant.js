// ryoAssistant (formerly geminiService.js) — Ryo chat engine.
// 100% offline, rule-based, grounded ONLY in website content (constants.js).
// No LLM, no API key, no network fetch, no external model of any kind.
// All answers are derived from the same single source of truth the site renders.

import {
  CONTACT,
  PROJECTS,
  EDUCATION_DATA,
  EXPERIENCES,
  ACHIEVEMENTS,
  CERTIFICATES,
  SKILLS_DATA,
} from '../constants';

const ASSISTANT_NAME = 'Ryo';

// ---------------------------------------------------------------------------
// Greetings / conversation necessities (not website facts, but required UX)
// ---------------------------------------------------------------------------

const GREETING_REGEXES = [
  /^(hi|hello|hey|greetings|howdy|sup|yo|hiya|namaste|vanakkam|hola|bonjour|aloha|salut|oi|hallo|ciao)[\s!.,?]*$/i,
  /^(hi|hello|hey|yo)\s+(there|ryo|bot|assistant|ryan|buddy|friend|bro)[\s!.,?]*$/i,
  /^(good\s+(morning|afternoon|evening|day|night))[\s!.,?]*$/i,
];

const GREETINGS = [
  `Hello! I'm **${ASSISTANT_NAME}**, Ryan George's personal assistant. Ask about his edge-AI, RAG, and multi-agent projects, data-science skills, or internships!`,
  `Hey there! I'm **${ASSISTANT_NAME}**, the guide to Ryan George's portfolio. Explore Xplora, ACP RAG Agent, AQI Digital Twin, or his IIIT & Olcademy experience.`,
  `Greetings! I'm **${ASSISTANT_NAME}**. I can share Ryan's Python/AI toolkit, Codecademy certifications, CGPA 9.21 record, or contact details.`,
];

// ---------------------------------------------------------------------------
// Website-grounded answer builders (all derived from constants.js)
// ---------------------------------------------------------------------------

const buildProjectsAnswer = () => {
  const lines = PROJECTS.map(
    (p, i) => `${i + 1}. **${p.title}** (${p.year}, ${p.category}) — ${p.description}`
  );
  return `Ryan's projects (from this website):\n\n${lines.join('\n\n')}`;
};

const buildProjectDetail = (id) => {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return null;
  return `**${p.title} (${p.year})** — ${p.category}\n${p.description}`;
};

const buildEducationAnswer = () =>
  EDUCATION_DATA.map(
    (e) =>
      `**${e.degree}**, ${e.field} at **${e.institute}**, ${e.location} (${e.year}). ` +
      e.metrics.map((m) => `${m.label}: ${m.value}`).join(', ')
  ).join('\n');

const buildExperienceAnswer = () =>
  EXPERIENCES.map(
    (e) =>
      `**${e.organization} — ${e.role} (${e.duration}, ${e.location})**: ${e.summary}`
  ).join('\n\n');

const buildCertificationsAnswer = () =>
  `Ryan holds **${CERTIFICATES.length} Professional certifications** (see Certificates page):\n\n` +
  CERTIFICATES.map((c) => `• **${c.title}** — ${c.issuer} (${c.year}, ${c.field})`).join('\n');

const buildAchievementsAnswer = () =>
  `Ryan's achievements (see Achievements page):\n\n` +
  ACHIEVEMENTS.map(
    (a) => `• **${a.title}** — ${a.issuer} (${a.year}): ${a.description}`
  ).join('\n\n');

const buildSkillsAnswer = () => {
  const radar = SKILLS_DATA.map((s) => `• **${s.subject}**: ${s.A}/100`).join('\n');
  return `Ryan's toolkit (see Profile page):\n\n• **AI/LLM**: LangChain, LangGraph, CrewAI, RAG, FAISS, ChromaDB\n• **ML/NLP**: TensorFlow, PyTorch, Scikit-learn, XGBoost, NLP, JAX (beginner)\n• **Data**: NumPy, Pandas, SciPy\n• **Backend**: Flask, FastAPI, MySQL\n• **Frontend**: React, JavaScript, Streamlit\n• **Deploy**: Vercel, Netlify, Render, GCP (basic)\n\nSkill levels:\n${radar}`;
};

const buildContactAnswer = () =>
  `Contact Ryan:\n• **Email**: ${CONTACT.email}\n• **GitHub**: ${CONTACT.github}\n• **LinkedIn**: ${CONTACT.linkedin}\n• **HuggingFace**: ${CONTACT.huggingface}\n• **Location**: ${CONTACT.location}`;

const CAPABILITY_ANSWER = `I can help with what's on this website:\n\n• **Projects**: ${PROJECTS.map((p) => p.title).join(', ')}\n• **Experience**: ${EXPERIENCES.map((e) => e.organization).join(', ')}\n• **Skills**: LangChain, LangGraph, RAG, FAISS, TensorFlow, PyTorch, FastAPI\n• **Education**: B.Tech CSE, Rajagiri (CGPA 9.21/10)\n• **Certifications**: ${CERTIFICATES.length}x Codecademy Professional\n• **Achievements**: ${ACHIEVEMENTS.length} highlights\n• **Contact**: \`${CONTACT.email}\``;

const OUT_OF_SCOPE_ANSWER = `I'm **${ASSISTANT_NAME}** and I only answer from Ryan's website — projects, skills, experience, education, certifications, achievements, or contact info. Try "Show me his projects" or "How can I contact Ryan?"`;

// ---------------------------------------------------------------------------
// Core router — ordered, deterministic, no LLM
// ---------------------------------------------------------------------------

export const getRyoAnswer = (rawMessage) => {
  const msg = (rawMessage || '').trim();
  const m = msg.toLowerCase();
  if (!m) return OUT_OF_SCOPE_ANSWER;

  // 1 — greetings
  if (GREETING_REGEXES.some((re) => re.test(msg)) || /^(how are you|how are u|whats up|what's up)[\s!.,?]*$/i.test(msg)) {
    return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  }
  if (/(how are you|how are u|whats up|what's up)/.test(m)) {
    return "I'm running great! What would you like to discover about Ryan's AI projects, toolkit, or experience?";
  }

  // 2 — identity
  if (/who\s+(made|built|created)\s+(you|u)/.test(m)) {
    return `I was created by **Ryan George Koickal** as an interactive assistant for his portfolio! I'm **${ASSISTANT_NAME}**.`;
  }
  if (/who are you|what are you|your name|introduce yourself|about you|ryo/.test(m) && /you|your|name|ryo|who|what/.test(m) && m.length < 60) {
    return `I'm **${ASSISTANT_NAME}**, Ryan George's assistant. I know his Xplora/ACP-RAG/AQI projects, IIIT Kottayam & Olcademy internships, 9.21 CGPA, and ${CERTIFICATES.length} Codecademy certifications — all from this website.`;
  }

  // 3 — capability / help
  if (/what can you do|how can you help|help me|^help$|menu|what can i ask|what do you know/.test(m)) {
    return CAPABILITY_ANSWER;
  }

  // 4 — thanks / bye (conversational)
  if (/(thank|thx|awesome|great|nice)/.test(m) && m.length < 40) {
    return 'Thank you! Let me know if you want deeper detail on any project, certification, or collaboration with Ryan!';
  }
  if (/^(bye|goodbye|see you|take care)/.test(m) || (/(bye|goodbye|see you|take care)/.test(m) && m.length < 30)) {
    return `Goodbye! Reach Ryan anytime at **${CONTACT.email}**!`;
  }

  // 5 — individual projects (before generic "projects")
  if (/xplora|travel agent|travel planner/.test(m)) return buildProjectDetail(1);
  if (/acp|rag agent/.test(m) || (m.includes('rag') && m.includes('agent'))) return buildProjectDetail(2);
  if (/aqi|digital twin|air quality/.test(m)) return buildProjectDetail(3);
  if (/bird|birdnet|raspberry/.test(m)) return buildProjectDetail(4);
  if (/restaurant|review intelligence|opentable/.test(m)) return buildProjectDetail(5);

  // 6 — achievements (check before generic project/skill words)
  if (/achiev|award|hackathon|nsoc|brik|buildathon|top 7|winner|confluence/.test(m)) {
    return buildAchievementsAnswer();
  }

  // 7 — projects (generic)
  if (/project|portfolio|built|what.*work|his work/.test(m)) return buildProjectsAnswer();

  // 8 — education
  if (/education|college|degree|study|rajagiri|cgpa|gpa|school|b\.?tech|cse/.test(m)) {
    return buildEducationAnswer();
  }

  // 9 — experience / internships
  if (/experience|internship|intern|iiit|kottayam|olcademy|research|data engineering/.test(m)) {
    return buildExperienceAnswer();
  }

  // 10 — certifications
  if (/certificat|credential|codecademy|course|tensorflow|pytorch/.test(m) && !/project/.test(m)) {
    // "tensorflow/pytorch" alone usually means certification or skill — prefer certification list
    // only when the query mentions certificates/courses; otherwise fall through to skills.
    if (/certificat|credential|codecademy|course/.test(m)) return buildCertificationsAnswer();
  }
  if (/certificat|credential|codecademy|course/.test(m)) return buildCertificationsAnswer();

  // 11 — RAG / multi-agent / LLM (project-grounded)
  if (/langchain|langgraph|crewai|multi-agent|multi agent|llm|genai|generative ai/.test(m)) {
    return 'Ryan builds **multi-agent systems** with LangChain, LangGraph, CrewAI, Gemini/Groq APIs, and FAISS/ChromaDB — see **Xplora Travel Agent** and **ACP RAG Agent** on the Projects page.';
  }

  // 12 — skills / stack
  if (/skill|stack|tech|tool|python|fastapi|flask|react|machine learning|data science|edge/.test(m)) {
    return buildSkillsAnswer();
  }

  // 13 — bio / about Ryan
  if (/who is ryan|about ryan|bio|summary|profile|about himself|background/.test(m)) {
    return `**${CONTACT.name}** is a B.Tech CSE student at Rajagiri School of Engineering & Technology (CGPA 9.21/10) and a Python developer/data scientist building edge-AI, RAG, and multi-agent LLM systems — from offline bird recognition on Raspberry Pi to real-time AQI digital twins. Based in **${CONTACT.location}**.`;
  }

  // 14 — hiring / collaboration
  if (/hire|collaborat|opportunity|freelance|recruit|job|internship opening|work with/.test(m)) {
    return `**Why work with Ryan?** Edge-AI + production RAG + multi-agent LLMs, ${EXPERIENCES.length} internships, ${PROJECTS.length} shipped projects, 9.21 CGPA. Contact **${CONTACT.email}**.`;
  }

  // 15 — contact / socials / location
  if (/contact|email|reach|phone|touch|mail/.test(m)) return buildContactAnswer();
  if (/github/.test(m)) return `Ryan's GitHub: **${CONTACT.github}**`;
  if (/linkedin/.test(m)) return `Ryan's LinkedIn: **${CONTACT.linkedin}** (certifications: ${CONTACT.linkedinCerts})`;
  if (/huggingface|hugging face|\bhf\b/.test(m)) return `Ryan's HuggingFace: **${CONTACT.huggingface}**`;
  if (/where|location|based|kakkanad|eranakulam|ernakulam|kerala|address|from/.test(m)) {
    return `Ryan is based in **${CONTACT.location}**.`;
  }

  // 16 — strict scope: everything else is out of scope (no math, no general knowledge)
  return OUT_OF_SCOPE_ANSWER;
};

// Backwards-compatible alias (old engine name)
export const getOfflinePortfolioAnswer = getRyoAnswer;

// ---------------------------------------------------------------------------
// Public API — same signature as before, but fully offline (no LLM, no fetch)
// ---------------------------------------------------------------------------

export const sendChatMessage = async (message) => {
  const trimmed = (message || '').trim();
  if (!trimmed) return OUT_OF_SCOPE_ANSWER;
  // No setTimeout here — the UI applies its own perceived thinking delay.
  return getRyoAnswer(trimmed);
};

// Backwards-compatible stubs: API keys are no longer used (no LLM).
// Kept so any legacy imports don't break.
export const getStoredApiKey = () => null;
export const setStoredApiKey = () => {};
export const SYSTEM_INSTRUCTION = `You are "${ASSISTANT_NAME}", an offline rule-based assistant that answers ONLY from Ryan George Koickal's portfolio website content. No LLM is used.`;
export const ASSISTANT_DISPLAY_NAME = ASSISTANT_NAME;
