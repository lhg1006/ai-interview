export interface InterviewSetup {
  position: string;        // 지원 직무
  experience: string;      // 경력 수준
  company: string;         // 지원 회사
  skills: string;          // 주요 기술/역량
  additionalInfo: string;  // 추가 정보
}

export interface InterviewQuestion {
  id: string;
  category: 'technical' | 'behavioral' | 'situational' | 'culture';
  question: string;
  tips?: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  timestamp: Date;
}

export interface QuestionFeedback {
  questionId: string;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
  score: number; // 1-10
}

export interface InterviewReport {
  overallScore: number;
  summary: string;
  questionFeedbacks: QuestionFeedback[];
  generalAdvice: string[];
}

export type InterviewPhase = 'setup' | 'interview' | 'feedback' | 'report';
