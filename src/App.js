import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Exam from './components/Exam';
import Results from './components/Results';
import ReviewFlagged from './components/ReviewFlagged';
import KCSAMockExamPro from './components/KCSAMockExamPro';
import Header from './components/Header';
import { getAllQuestions, getAvailableDomains } from './questionsDatabase';
import useLocalStorage from './hooks/useLocalStorage';
import { Analytics } from "@vercel/analytics/react"
import './styles/star-feature.css';

function App() {
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

  // Define all callback functions using useCallback
  const setNumQuestionsCallback = useCallback((value) => {
    setNumQuestions(value);
  }, []);

  const setSelectedDomainsCallback = useCallback((value) => {
    setSelectedDomains(value);
  }, []);

  const setStarredQuestionsCallback = useCallback((value) => {
    setStarredQuestions(value);
  }, []);

  const setUserAnswersCallback = useCallback((value) => {
    setUserAnswers(value);
  }, []);

  const setFlaggedQuestionsCallback = useCallback((value) => {
    setFlaggedQuestions(value);
  }, []);

  const setCurrentQuestionIndexCallback = useCallback((value) => {
    setCurrentQuestionIndex(value);
  }, []);

  const setTimeLeftCallback = useCallback((value) => {
    setTimeLeft(value);
  }, []);

  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const startExam = useCallback(async (starredOnly = false) => {
    if (selectedDomains.length === 0) {
      console.error("Cannot start exam with no domains selected.");
      return;
    }

    if (starredOnly && starredQuestions.length === 0) {
      alert("You don't have any starred questions yet. Please star some questions first or start a regular exam.");
      return;
    }

    setLoading(true);
    try {
      let filteredQuestions = await getAllQuestions(selectedDomains);

      if (starredOnly) {
        filteredQuestions = filteredQuestions.filter(q => starredQuestions.includes(q.id));
        console.log(`Filtered to ${filteredQuestions.length} starred questions`);
      }

      if (filteredQuestions.length === 0) {
        console.error("No questions found for the selected criteria.");
        setLoading(false);
        return;
      }

      const actualNumQuestions = Math.min(numQuestions, filteredQuestions.length);
      if (numQuestions > filteredQuestions.length) {
        console.warn(`Requested ${numQuestions} questions, but only ${filteredQuestions.length} are available for the selected criteria. Using ${filteredQuestions.length}.`);
        setNumQuestions(actualNumQuestions);
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
      setTimeLeft(actualNumQuestions * 60);
      setUseStarredOnly(starredOnly);
      localStorage.setItem('examStarted', 'true');
      localStorage.setItem('examFinished', 'false');
      localStorage.setItem('reviewingFlagged', 'false');
    } catch (err) {
      console.error("Error starting exam:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedDomains, starredQuestions, numQuestions, shuffleArray, setExamQuestions, setUserAnswers, setFlaggedQuestions, setCurrentQuestionIndex, setTimeLeft]);

  const restartExam = useCallback(() => {
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
  }, [setUserAnswers, setFlaggedQuestions, setCurrentQuestionIndex, setTimeLeft, setExamQuestions]);

  // Memoize computed values
  const maxQuestions = useMemo(() => {
    return availableDomains.length > 0 ? 1000 : 0;
  }, [availableDomains.length]);

  const shouldShowHome = useMemo(() => {
    return !examStarted && !examFinished && !reviewingFlagged;
  }, [examStarted, examFinished, reviewingFlagged]);

  const shouldShowExam = useMemo(() => {
    return examStarted && !reviewingFlagged && examQuestions.length > 0;
  }, [examStarted, reviewingFlagged, examQuestions.length]);

  const shouldShowReview = useMemo(() => {
    return reviewingFlagged && examQuestions.length > 0;
  }, [reviewingFlagged, examQuestions.length]);

  const shouldShowResults = useMemo(() => {
    return examFinished && examQuestions.length > 0;
  }, [examFinished, examQuestions.length]);

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
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading domains:", err);
        setLoading(false);
      });
  }, [selectedDomains.length]);

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

  // Update localStorage when state changes - consolidated into one useEffect
  useEffect(() => {
    localStorage.setItem('examStarted', examStarted.toString());
    localStorage.setItem('examFinished', examFinished.toString());
    localStorage.setItem('reviewingFlagged', reviewingFlagged.toString());
  }, [examStarted, examFinished, reviewingFlagged]);

  if (loading) {
    return (
      <div className="App">
        <Header />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          fontSize: '1.2rem',
          color: 'var(--color-text-secondary)'
        }}>
          Loading exam data...
        </div>
        <Analytics />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>
          {/* Home page - KCSAMockExamPro component */}
          <Route
            path="/"
            element={
              // shouldShowHome ? (
              <KCSAMockExamPro
                numQuestions={numQuestions}
                setNumQuestions={setNumQuestionsCallback}
                startExam={startExam}
                maxQuestions={maxQuestions}
                availableDomains={availableDomains}
                selectedDomains={selectedDomains}
                setSelectedDomains={setSelectedDomainsCallback}
                starredQuestions={starredQuestions}
                setStarredQuestions={setStarredQuestionsCallback}
              />
              // ) : (
              //   <Navigate to="/exam" replace />
              // )
            }
          />

          {/* Exam page */}
          <Route
            path="/exam"
            element={
              // shouldShowExam ? (
              <Exam
                questions={examQuestions}
                userAnswers={userAnswers}
                setUserAnswers={setUserAnswersCallback}
                flaggedQuestions={flaggedQuestions}
                setFlaggedQuestions={setFlaggedQuestionsCallback}
                currentQuestionIndex={currentQuestionIndex}
                setCurrentQuestionIndex={setCurrentQuestionIndexCallback}
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeftCallback}
                starredQuestions={starredQuestions}
                setStarredQuestions={setStarredQuestionsCallback}
              />
              // ) : (
              //   <Navigate to="/" replace />
              // )
            }
          />

          {/* Review flagged questions page */}
          <Route
            path="/review"
            element={
              // shouldShowReview ? (
              <ReviewFlagged
                questions={examQuestions}
                userAnswers={userAnswers}
                setUserAnswers={setUserAnswersCallback}
                flaggedQuestions={flaggedQuestions}
                setFlaggedQuestions={setFlaggedQuestionsCallback}
                starredQuestions={starredQuestions}
                setStarredQuestions={setStarredQuestionsCallback}
              />
              // ) : (
              //   <Navigate to="/" replace />
              // )
            }
          />

          {/* Results page */}
          <Route
            path="/results"
            element={
              // shouldShowResults ? (
              <Results
                questions={examQuestions}
                userAnswers={userAnswers}
                starredQuestions={starredQuestions}
                setStarredQuestions={setStarredQuestionsCallback}
              />
              // ) : (
              //   <Navigate to="/" replace />
              // )
            }
          />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Analytics />
      </div>
    </Router>
  );
}

export default App;
