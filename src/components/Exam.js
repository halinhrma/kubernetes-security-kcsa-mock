import React, { useEffect, useState } from 'react';
import Question from './Question';
import Navigation from './Navigation';
import ProgressBar from './ProgressBar';
import SideMenu from './SideMenu';

function Exam({
  questions,
  userAnswers,
  setUserAnswers,
  flaggedQuestions,
  setFlaggedQuestions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  timeLeft,
  setTimeLeft,
  onFinish,
  starredQuestions,
  setStarredQuestions
}) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onFinish();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setTimeLeft, onFinish]);

  const handleAnswer = (questionId, selectedAnswers) => {
    setUserAnswers({ ...userAnswers, [questionId]: selectedAnswers });
  };

  const handleFlag = () => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    if (flaggedQuestions.includes(currentQuestionId)) {
      setFlaggedQuestions(flaggedQuestions.filter(id => id !== currentQuestionId));
    } else {
      setFlaggedQuestions([...flaggedQuestions, currentQuestionId]);
    }
  };

  const handleStar = (questionId) => {
    if (starredQuestions.includes(questionId)) {
      setStarredQuestions(starredQuestions.filter(id => id !== questionId));
    } else {
      setStarredQuestions([...starredQuestions, questionId]);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <div className="exam">
      <div className="exam-header">
        <div className="timer">Time left: {formatTime(timeLeft)}</div>
        <button 
          className="finish-exam-btn"
          onClick={onFinish}
          title="Finish exam and review answers"
        >
          Finish Exam
        </button>
      </div>
      <div className="exam-content">
        <button className="menu-toggle" onClick={toggleSideMenu} aria-label="Toggle question menu">
          <span className="menu-icon">☰</span>
          <span className="menu-text">{isSideMenuOpen ? 'Close Menu' : 'Questions'}</span>
        </button>
        <SideMenu
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          flaggedQuestions={flaggedQuestions}
          starredQuestions={starredQuestions}
          userAnswers={userAnswers}
          isOpen={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />
        <div className="main-content">
          <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
          <Question
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            userAnswer={userAnswers[questions[currentQuestionIndex].id] || []}
            onStar={handleStar}
            isStarred={starredQuestions.includes(questions[currentQuestionIndex].id)}
          />
          <Navigation
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onPrevious={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            onNext={() => {
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              } else {
                onFinish();
              }
            }}
            onFlag={handleFlag}
            isFlagged={flaggedQuestions.includes(questions[currentQuestionIndex].id)}
            onStar={handleStar}
            isStarred={starredQuestions.includes(questions[currentQuestionIndex].id)}
            questionId={questions[currentQuestionIndex].id}
          />
        </div>
      </div>
    </div>
  );
}

export default Exam;