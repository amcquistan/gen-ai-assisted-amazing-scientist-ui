export interface Scientist {
  _id: string;
  name: string;
  lifespan: string;
  birth_year?: number;
  death_year?: number;
  accomplishments: string;
  detailed_bio?: string;
  url: string;
  scraped_at: string;
}

export interface ScientistSummary {
  _id: string;
  name: string;
  lifespan: string;
  accomplishments: string;
}

export interface SearchResponse {
  scientists: ScientistSummary[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface QuizQuestion {
  correct_scientist: ScientistSummary;
  options: ScientistSummary[];
}

export interface QuizState {
  currentQuestion: QuizQuestion | null;
  score: number;
  totalQuestions: number;
  isAnswered: boolean;
  selectedAnswer: string | null;
  gameOver: boolean;
}