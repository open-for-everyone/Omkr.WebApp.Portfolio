export interface ResumeData {
  name: string;
  title: string;
  contact: {
    email: string;
    mobile: string;
    github: string;
    portfolio: string;
    locations: string[];
  };
  summary: string;
  experience: ExperienceEntry[];
  skills: SkillsSection;
  education: EducationEntry[];
  links: { label: string; url: string }[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  dateRange: string;
  project?: string;
  projects?: string[];
  bullets?: string[];
  projectGroups?: { name: string; bullets: string[] }[];
}

export interface SkillsSection {
  languagesFrameworks: string[];
  aws: string[];
  azure: string[];
  databases: string[];
  devopsTools: string[];
  securityObservability: string[];
  other: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  dateRange: string;
  aggregate?: string;
}
