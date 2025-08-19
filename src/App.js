import React, { useState, useEffect } from 'react';
import Exam from './components/Exam';
import Results from './components/Results';
import ReviewFlagged from './components/ReviewFlagged';
import HomePage from './components/HomePage';
import Header from './components/Header';
import { getAllQuestions, getAvailableDomains } from './questionsDatabase'; // adjust the path as needed

import useLocalStorage from './hooks/useLocalStorage';
import { Analytics } from "@vercel/analytics/react"
import './styles/star-feature.css';

function App() {
  // Removed unused 'questions' and 'setQuestions' state
  const [loading, setLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [reviewingFlagged, setReviewingFlagged] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [examQuestions, setExamQuestions] = useLocalStorage('examQuestions', []);
  const [userAnswers, setUserAnswers] = useLocalStorage('userAnswers', {});
  const [flaggedQuestions, setFlaggedQuestions] = useLocalStorage('flaggedQuestions', []);
  const [starredQuestions, setStarredQuestions] = useLocalStorage('starredQuestions', []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useLocalStorage('currentQuestionIndex', 0);
  const [timeLeft, setTimeLeft] = useLocalStorage('timeLeft', 0);
  const [availableDomains, setAvailableDomains] = useState([]);
  const [selectedDomains, setSelectedDomains] = useLocalStorage('selectedDomains', []);
  const [useStarredOnly, setUseStarredOnly] = useState(false);

  // Load available domains and potentially all questions initially (or just domains)
  useEffect(() => {
    setLoading(true);
    getAvailableDomains()
      .then(domains => {
        setAvailableDomains(domains);
        // Initialize selectedDomains to all available domains if it's empty
        if (selectedDomains.length === 0 && domains.length > 0) {
          setSelectedDomains(domains);
        }
        // Optionally load all questions here if needed elsewhere, or just fetch filtered ones later
        // For now, just mark loading as false after getting domains
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading domains:", err);
        setLoading(false); // Ensure loading stops even on error
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount, disable warning for conditional setSelectedDomains

  // Load persisted state from localStorage
  useEffect(() => {
    const storedExamStarted = localStorage.getItem('examStarted');
    const storedExamFinished = localStorage.getItem('examFinished');
    const storedReviewingFlagged = localStorage.getItem('reviewingFlagged');

    if (storedExamStarted === 'true') {
      setExamStarted(true);
    }

    if (storedExamFinished === 'true') {
      setExamFinished(true);
    }

    if (storedReviewingFlagged === 'true') {
      setReviewingFlagged(true);
    }
  }, []);

  if (loading) {
    return <div>Loading exam data...</div>; // Updated loading message
  }

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  // Removed console.log("Exam Questions:", questions); as it logged all questions before filtering

  const startExam = async (starredOnly = false) => { // Make async to await getAllQuestions
    if (selectedDomains.length === 0) {
      console.error("Cannot start exam with no domains selected.");
      // Optionally show an error message to the user
      return;
    }

    // Check if user wants to use starred questions only
    if (starredOnly && starredQuestions.length === 0) {
      alert("You don't have any starred questions yet. Please star some questions first or start a regular exam.");
      return;
    }

    setLoading(true); // Show loading indicator while fetching/processing
    try {
      let filteredQuestions = await getAllQuestions(selectedDomains);

      // If using starred questions only, filter to only include starred ones
      if (starredOnly) {
        filteredQuestions = filteredQuestions.filter(q => starredQuestions.includes(q.id));
        console.log(`Filtered to ${filteredQuestions.length} starred questions`);
      }

      if (filteredQuestions.length === 0) {
        console.error("No questions found for the selected criteria.");
        // Optionally show an error message to the user
        setLoading(false);
        return;
      }

      // Adjust numQuestions if it exceeds the number of available filtered questions
      const actualNumQuestions = Math.min(numQuestions, filteredQuestions.length);
      if (numQuestions > filteredQuestions.length) {
        console.warn(`Requested ${numQuestions} questions, but only ${filteredQuestions.length} are available for the selected criteria. Using ${filteredQuestions.length}.`);
        setNumQuestions(filteredQuestions.length); // Update state if adjusted
      }

      const shuffledQuestions = shuffleArray(filteredQuestions);
      const selectedQuestions = shuffledQuestions.slice(0, actualNumQuestions);

      setExamQuestions(selectedQuestions);
      setExamStarted(true);
      setExamFinished(false);
      setReviewingFlagged(false);
      setUserAnswers({});
      setFlaggedQuestions([]);
      setCurrentQuestionIndex(0);
      setTimeLeft(actualNumQuestions * 60); // Use actual number of questions for timer
      setUseStarredOnly(starredOnly);
      localStorage.setItem('examStarted', 'true');
      localStorage.setItem('examFinished', 'false');
      localStorage.setItem('reviewingFlagged', 'false');
    } catch (err) {
      console.error("Error starting exam:", err);
      // Optionally show an error message to the user
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const finishExam = () => {
    // Removed setUserAnswers({}) and setFlaggedQuestions([]) which were clearing results prematurely
    setExamFinished(true);
    setExamStarted(false);
    setReviewingFlagged(false); // Ensure review flag is off when finishing
    localStorage.setItem('examStarted', 'false');
    localStorage.setItem('examFinished', 'true');
    localStorage.setItem('reviewingFlagged', 'false');
  };

  const startReview = () => {
    setReviewingFlagged(true);
    localStorage.setItem('reviewingFlagged', 'true');
  };

  // Removed unused endReview function

  const restartExam = () => {
    setExamStarted(false);
    setExamFinished(false);
    setReviewingFlagged(false);
    setUserAnswers({});
    setFlaggedQuestions([]);
    setCurrentQuestionIndex(0);
    setTimeLeft(0);
    setExamQuestions([]);
    setUseStarredOnly(false);
    localStorage.removeItem('examStarted');
    localStorage.removeItem('examFinished');
    localStorage.removeItem('reviewingFlagged');
    localStorage.removeItem('examQuestions');
    localStorage.removeItem('userAnswers');
    localStorage.removeItem('flaggedQuestions');
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('timeLeft');
  };

  return (
    <div className="App">
      <Header />

      {!examStarted && !examFinished && !reviewingFlagged ? (
        <HomePage
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
          startExam={startExam}
          // maxQuestions prop is less relevant now as it's handled dynamically in startExam
          // We could pass a function to get the count based on selected domains if needed for display
          maxQuestions={availableDomains.length > 0 ? 1000 : 0} // Placeholder, actual limit is dynamic
          availableDomains={availableDomains}
          selectedDomains={selectedDomains}
          setSelectedDomains={selectedDomains}
          starredQuestions={starredQuestions}
          setStarredQuestions={setStarredQuestions}
          onRestart={restartExam}
        />
      ) : (
        <>
          {examStarted && !reviewingFlagged && (
            <Exam
              questions={examQuestions}
              userAnswers={userAnswers}
              setUserAnswers={setUserAnswers}
              flaggedQuestions={flaggedQuestions}
              setFlaggedQuestions={setFlaggedQuestions}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              onFinish={startReview}
              starredQuestions={starredQuestions}
              setStarredQuestions={setStarredQuestions}
            />
          )}
          {reviewingFlagged && (
            <ReviewFlagged
              questions={examQuestions}
              userAnswers={userAnswers}
              setUserAnswers={setUserAnswers}
              flaggedQuestions={flaggedQuestions}
              setFlaggedQuestions={setFlaggedQuestions}
              starredQuestions={starredQuestions}
              setStarredQuestions={setStarredQuestions}
              onFinish={finishExam}
            />
          )}
          {examFinished && (
            <Results
              questions={examQuestions}
              userAnswers={userAnswers}
              onRestart={restartExam}
              starredQuestions={starredQuestions}
              setStarredQuestions={setStarredQuestions}
            />
          )}
        </>
      )}
      <Analytics />
    </div>
  );
}

export default App;
