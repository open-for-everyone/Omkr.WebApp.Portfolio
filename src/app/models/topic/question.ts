export interface Question {
  id?: string;
  questionId?: string;
  topic: string;
  subtopic: string;
  questionText: string;
  answer: string;
  difficulty: string;
  tags: string[];
  references: string[];
}
