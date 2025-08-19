import React, { useState } from 'react';
import Question from './Question';
import Navigation from './Navigation';

function ReviewFlagged({
  questions,
  userAnswers,
  setUserAnswers,
  flaggedQuestions,
  setFlaggedQuestions,
  starredQuestions,
  setStarredQuestions,
  onFinish
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flaggedQuestionIds = flaggedQuestions.filter(id => questions.some(q => q.id === id));
  const currentQuestion = questions.find(q => q.id === flaggedQuestionIds[currentIndex]);

  const handleAnswer = (questionId, selectedAnswers) => {
    setUserAnswers({ ...userAnswers, [questionId]: selectedAnswers });
  };

  const handleFlag = () => {
    const currentQuestionId = currentQuestion.id;
    setFlaggedQuestions(flaggedQuestions.filter(id => id !== currentQuestionId));
  };

  const handleStar = (questionId) => {
    if (starredQuestions.includes(questionId)) {
      setStarredQuestions(starredQuestions.filter(id => id !== questionId));
    } else {
      setStarredQuestions([...starredQuestions, questionId]);
    }
  };

  return (
    <div className="review-flagged">
      <div className="review-header">
        <h2>Review Flagged Questions</h2>
        <button 
          className="finish-review-btn"
          onClick={onFinish}
          title="Finish review and see results"
        >
          Finish Review
        </button>
      </div>
      {flaggedQuestionIds.length > 0 ? (
        <>
          <Question
            question={currentQuestion}
            onAnswer={handleAnswer}
            userAnswer={userAnswers[currentQuestion.id] || []}
            onStar={handleStar}
            isStarred={starredQuestions.includes(currentQuestion.id)}
          />
          <Navigation
            currentIndex={currentIndex}
            totalQuestions={flaggedQuestionIds.length}
            onPrevious={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            onNext={() => {
              if (currentIndex < flaggedQuestionIds.length - 1) {
                setCurrentIndex(currentIndex + 1);
              } else {
                onFinish();
              }
            }}
            onFlag={handleFlag}
            isFlagged={true}
          />
        </>
      ) : (
        <div>
          <p>No flagged questions to review.</p>
          <button onClick={onFinish}>Finish Exam</button>
        </div>
      )}
    </div>
  );
}

export default ReviewFlagged;