import React from 'react';

interface ScoreBoardProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  gameOver: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, totalQuestions, onRestart, gameOver }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  return (
    <div className="score-display mb-4">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h5 className="mb-1">Score: {score} / {totalQuestions}</h5>
          <div className="progress" style={{ height: '10px' }}>
            <div
              className={`progress-bar bg-${getScoreColor()}`}
              role="progressbar"
              style={{ width: `${percentage}%` }}
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
            </div>
          </div>
          <small>{percentage}% correct</small>
        </div>
        
        <div className="col-md-6 text-md-end mt-3 mt-md-0">
          {gameOver ? (
            <div>
              <h6 className="mb-2">Game Complete!</h6>
              <button 
                className="btn btn-light btn-sm"
                onClick={onRestart}
              >
                Play Again
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-light btn-sm"
              onClick={onRestart}
            >
              Restart Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;