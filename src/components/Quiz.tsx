import React, { useState, useEffect, useCallback } from 'react';
import { ScientistSummary, QuizQuestion, QuizState } from '../types/scientist';
import { scientistService } from '../services/api';
import QuizCard from './QuizCard';
import ScoreBoard from './ScoreBoard';
import LoadingSpinner from './LoadingSpinner';

const QUESTIONS_PER_GAME = 10;
const OPTIONS_PER_QUESTION = 5;

const Quiz: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: null,
    score: 0,
    totalQuestions: 0,
    isAnswered: false,
    selectedAnswer: null,
    gameOver: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scientists, setScientists] = useState<ScientistSummary[]>([]);

  // Fetch scientists data
  const fetchScientists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch a good pool of scientists to choose from
      const response = await scientistService.getRandomScientists(50);
      
      if (response.scientists.length < OPTIONS_PER_QUESTION) {
        throw new Error(`Not enough scientists available. Need at least ${OPTIONS_PER_QUESTION}.`);
      }
      
      setScientists(response.scientists);
    } catch (err) {
      console.error('Error fetching scientists:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch scientists data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate a new quiz question
  const generateQuestion = useCallback((): QuizQuestion | null => {
    if (scientists.length < OPTIONS_PER_QUESTION) {
      return null;
    }

    // Create a shuffled copy of scientists array
    const shuffled = [...scientists].sort(() => Math.random() - 0.5);
    
    // Select the correct scientist and create options
    const correct_scientist = shuffled[0];
    const options = shuffled.slice(0, OPTIONS_PER_QUESTION);
    
    // Shuffle options again to randomize the correct answer position
    const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

    return {
      correct_scientist,
      options: shuffledOptions
    };
  }, [scientists]);

  // Start a new game
  const startNewGame = useCallback(() => {
    const firstQuestion = generateQuestion();
    
    setQuizState({
      currentQuestion: firstQuestion,
      score: 0,
      totalQuestions: 0,
      isAnswered: false,
      selectedAnswer: null,
      gameOver: false
    });
  }, [generateQuestion]);

  // Handle answer selection
  const handleAnswer = (selectedScientistId: string) => {
    if (quizState.isAnswered || !quizState.currentQuestion) return;

    const isCorrect = selectedScientistId === quizState.currentQuestion.correct_scientist._id;
    const newTotalQuestions = quizState.totalQuestions + 1;
    const newScore = isCorrect ? quizState.score + 1 : quizState.score;

    setQuizState(prev => ({
      ...prev,
      isAnswered: true,
      selectedAnswer: selectedScientistId,
      score: newScore,
      totalQuestions: newTotalQuestions,
      gameOver: newTotalQuestions >= QUESTIONS_PER_GAME
    }));

    // Move to next question after a delay (unless game is over)
    if (newTotalQuestions < QUESTIONS_PER_GAME) {
      setTimeout(() => {
        const nextQuestion = generateQuestion();
        setQuizState(prev => ({
          ...prev,
          currentQuestion: nextQuestion,
          isAnswered: false,
          selectedAnswer: null
        }));
      }, 2000);
    }
  };

  // Initialize the quiz
  useEffect(() => {
    fetchScientists();
  }, [fetchScientists]);

  // Start new game when scientists are loaded
  useEffect(() => {
    if (scientists.length >= OPTIONS_PER_QUESTION && !quizState.currentQuestion) {
      startNewGame();
    }
  }, [scientists, quizState.currentQuestion, startNewGame]);

  if (loading) {
    return <LoadingSpinner message="Loading amazing scientists..." />;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error!</h4>
              <p>{error}</p>
              <hr />
              <button className="btn btn-outline-danger" onClick={fetchScientists}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizState.currentQuestion) {
    return <LoadingSpinner message="Preparing your quiz..." />;
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-4">
            <h1 className="text-white display-4 mb-2">Amazing Scientists Quiz</h1>
            <p className="text-white-50 lead">Test your knowledge of history's greatest minds!</p>
          </div>

          <ScoreBoard
            score={quizState.score}
            totalQuestions={quizState.totalQuestions}
            onRestart={startNewGame}
            gameOver={quizState.gameOver}
          />

          {!quizState.gameOver && (
            <>
              <div className="text-center mb-3">
                <span className="badge bg-light text-dark fs-6">
                  Question {quizState.totalQuestions + 1} of {QUESTIONS_PER_GAME}
                </span>
              </div>

              <QuizCard
                scientist={quizState.currentQuestion.correct_scientist}
                options={quizState.currentQuestion.options}
                onAnswer={handleAnswer}
                isAnswered={quizState.isAnswered}
                selectedAnswer={quizState.selectedAnswer}
                correctAnswer={quizState.currentQuestion.correct_scientist._id}
              />

              {quizState.isAnswered && (
                <div className="text-center mt-4">
                  <div className={`alert ${quizState.selectedAnswer === quizState.currentQuestion.correct_scientist._id ? 'alert-success' : 'alert-danger'}`}>
                    {quizState.selectedAnswer === quizState.currentQuestion.correct_scientist._id ? (
                      <span>✅ Correct! Well done!</span>
                    ) : (
                      <span>❌ Incorrect. The correct answer was {quizState.currentQuestion.correct_scientist.name}</span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {quizState.gameOver && (
            <div className="text-center">
              <div className="card card-custom">
                <div className="card-body">
                  <h2 className="card-title text-primary mb-4">🎉 Game Complete!</h2>
                  <p className="card-text fs-5 mb-4">
                    You scored {quizState.score} out of {quizState.totalQuestions} questions!
                  </p>
                  <div className="mb-4">
                    {quizState.score === quizState.totalQuestions && (
                      <div className="alert alert-success">
                        🏆 Perfect score! You're a science history expert!
                      </div>
                    )}
                    {quizState.score >= quizState.totalQuestions * 0.8 && quizState.score < quizState.totalQuestions && (
                      <div className="alert alert-info">
                        🌟 Excellent work! You know your scientists well!
                      </div>
                    )}
                    {quizState.score >= quizState.totalQuestions * 0.6 && quizState.score < quizState.totalQuestions * 0.8 && (
                      <div className="alert alert-warning">
                        👍 Good job! Keep learning about these amazing minds!
                      </div>
                    )}
                    {quizState.score < quizState.totalQuestions * 0.6 && (
                      <div className="alert alert-secondary">
                        📚 Keep studying! There's so much to learn about these brilliant scientists!
                      </div>
                    )}
                  </div>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={startNewGame}
                  >
                    Play Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;