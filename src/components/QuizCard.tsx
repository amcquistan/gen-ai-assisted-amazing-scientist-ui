import React from 'react';
import { ScientistSummary } from '../types/scientist';

interface QuizCardProps {
  scientist: ScientistSummary;
  options: ScientistSummary[];
  onAnswer: (selectedScientistId: string) => void;
  isAnswered: boolean;
  selectedAnswer: string | null;
  correctAnswer: string;
}

const QuizCard: React.FC<QuizCardProps> = ({
  scientist,
  options,
  onAnswer,
  isAnswered,
  selectedAnswer,
  correctAnswer
}) => {
  const getButtonClass = (optionId: string) => {
    if (!isAnswered) return 'answer-btn btn';
    
    if (optionId === correctAnswer) return 'answer-btn btn correct';
    if (optionId === selectedAnswer && optionId !== correctAnswer) return 'answer-btn btn incorrect';
    return 'answer-btn btn';
  };

  return (
    <div className="card card-custom scientist-card fade-in">
      <div className="card-body">
        <h4 className="card-title mb-4">Who is this scientist?</h4>
        
        <div className="mb-4">
          <h6 className="text-light mb-2">Accomplishments:</h6>
          <p className="fs-6">{scientist.accomplishments}</p>
        </div>
        
        <div className="mb-4">
          <h6 className="text-light mb-2">Lifespan:</h6>
          <p className="fs-6">{scientist.lifespan}</p>
        </div>

        <div className="mt-4">
          <h6 className="text-light mb-3">Choose the correct scientist:</h6>
          <div className="d-flex flex-wrap justify-content-center">
            {options.map((option) => (
              <button
                key={option._id}
                className={getButtonClass(option._id)}
                onClick={() => !isAnswered && onAnswer(option._id)}
                disabled={isAnswered}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;