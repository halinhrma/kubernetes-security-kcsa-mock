import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  starredQuestions,
  setStarredQuestions
}) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          navigate('/review');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setTimeLeft, navigate]);

  // Add safety check for questions array
  if (!questions || questions.length === 0) {
    return (
      <div className="exam">
        <div className="exam-header">
          <div className="timer">No questions available</div>
          <button
            className="finish-exam-btn"
            onClick={() => navigate('/')}
            title="Go back to home"
          >
            Back to Home
          </button>
        </div>
        <div className="exam-content">
          <p>No questions are available. Please go back and try again.</p>
        </div>
      </div>
    );
  }

  // Add safety check for currentQuestionIndex
  if (currentQuestionIndex >= questions.length) {
    setCurrentQuestionIndex(0);
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="exam">
        <div className="exam-header">
          <div className="timer">Question not found</div>
          <button
            className="finish-exam-btn"
            onClick={() => navigate('/')}
            title="Go back to home"
          >
            Back to Home
          </button>
        </div>
        <div className="exam-content">
          <p>Question not found. Please go back and try again.</p>
        </div>
      </div>
    );
  }

  const handleAnswer = (questionId, selectedAnswers) => {
    setUserAnswers({ ...userAnswers, [questionId]: selectedAnswers });
  };

  const handleFlag = () => {
    const currentQuestionId = currentQuestion.id;
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

  const handleFinishExam = () => {
    // Update localStorage to indicate we're reviewing flagged questions
    localStorage.setItem('reviewingFlagged', 'true');
    navigate('/review');
  };

  return (
    <div className="exam">
      <div className="exam-header">
        <div className="timer">Time left: {formatTime(timeLeft)}</div>
        <button
          className="finish-exam-btn"
          onClick={handleFinishExam}
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
            question={currentQuestion}
            onAnswer={handleAnswer}
            userAnswer={userAnswers[currentQuestion.id] || []}
            onStar={handleStar}
            isStarred={starredQuestions.includes(currentQuestion.id)}
          />
          <Navigation
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onPrevious={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            onNext={() => {
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              } else {
                navigate('/review');
              }
            }}
            onFlag={handleFlag}
            isFlagged={flaggedQuestions.includes(currentQuestion.id)}
            onStar={handleStar}
            isStarred={starredQuestions.includes(currentQuestion.id)}
            questionId={currentQuestion.id}
          />
        </div>
      </div>
    </div>
  );
}

export default Exam;