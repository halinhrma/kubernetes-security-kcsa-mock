import React, { useState } from 'react';

function HomePage({
  numQuestions,
  setNumQuestions,
  startExam,
  maxQuestions,
  availableDomains,
  selectedDomains,
  setSelectedDomains,
  starredQuestions,
  setStarredQuestions,
  onRestart
}) {
  const [showOptions, setShowOptions] = useState(false);

  const handleDomainChange = (domain) => {
    setSelectedDomains(prevSelected => {
      if (prevSelected.includes(domain)) {
        if (prevSelected.length === 1) {
          return prevSelected;
        }
        return prevSelected.filter(d => d !== domain);
      } else {
        return [...prevSelected, domain];
      }
    });
  };

  const handleStartRegularExam = () => {
    startExam(false);
  };

  const handleStartStarredExam = () => {
    startExam(true);
  };

  const getDomainDisplayName = (domain) => {
    return domain
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="hero-gradient"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🚀</span>
            <span className="badge-text">KCSA Mock Exam</span>
          </div>
          <h1 className="hero-title">
            Master Kubernetes Security
          </h1>
          <p className="hero-subtitle">
            Prepare for your KCSA certification with our comprehensive practice exams.
            Test your knowledge across all security domains with real-world scenarios.
          </p>

          {/* Stats Grid */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <span className="stat-number">{maxQuestions}</span>
                <span className="stat-label">Questions Available</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span className="stat-number">{starredQuestions.length}</span>
                <span className="stat-label">Starred Questions</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛡️</div>
              <div className="stat-content">
                <span className="stat-number">{availableDomains?.length || 0}</span>
                <span className="stat-label">Security Domains</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Quick Start Section */}
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">⚡</span>
              Quick Start
            </h2>
            <p className="section-description">
              Get started with your practice exam in seconds. Choose your question count and begin immediately.
            </p>
          </div>

          <div className="quick-start-card">
            {/* Question Count Input */}
            <div className="input-section">
              <label htmlFor="num-questions-input" className="input-label">
                <span className="label-icon">📝</span>
                Number of Questions
              </label>
              <div className="input-wrapper">
                <input
                  id="num-questions-input"
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Math.max(1, Math.min(maxQuestions, parseInt(e.target.value) || 0)))}
                  className="question-input"
                  min="1"
                  max={maxQuestions}
                  placeholder="Enter number of questions"
                  style={{ minWidth: 100 }}
                />
                <span className="input-hint">Max: {maxQuestions}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={handleStartRegularExam}
                className="primary-button"
                disabled={selectedDomains.length === 0}
              >
                <span className="button-icon">▶️</span>
                <span className="button-text">Start Practice Exam</span>
                <div className="button-shine"></div>
              </button>

              <button
                onClick={handleStartStarredExam}
                className="secondary-button"
                disabled={selectedDomains.length === 0 || starredQuestions.length === 0}
                title={starredQuestions.length === 0 ? "No starred questions yet" : `Start exam with ${starredQuestions.length} starred questions`}
              >
                <span className="button-icon">⭐</span>
                <span className="button-text">Starred Questions ({starredQuestions.length})</span>
              </button>
            </div>

            {/* Starred Questions Info */}
            {starredQuestions.length > 0 && (
              <div className="starred-info">
                <div className="starred-badge">
                  <span className="star-icon">⭐</span>
                  <span className="starred-text">
                    You have {starredQuestions.length} starred question{starredQuestions.length !== 1 ? 's' : ''} saved
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Options Section */}
        <div className="section-container">
          <div className="options-toggle">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="toggle-button"
              aria-expanded={showOptions}
            >
              <span className="toggle-icon">{showOptions ? '▼' : '▶'}</span>
              <span className="toggle-text">
                {showOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </span>
            </button>
          </div>

          {showOptions && availableDomains && availableDomains.length > 0 && (
            <div className="domain-selection-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="title-icon">🎯</span>
                  Customize Your Exam
                </h3>
                <p className="card-description">
                  Select specific security domains to focus your practice. Only questions from selected domains will be included in your exam.
                </p>
              </div>

              <div className="domain-grid">
                {availableDomains.map(domain => (
                  <div key={domain} className="domain-item">
                    <label className="domain-checkbox-label">
                      <input
                        type="checkbox"
                        value={domain}
                        checked={selectedDomains.includes(domain)}
                        onChange={() => handleDomainChange(domain)}
                        className="domain-checkbox"
                      />
                      <span className="checkbox-custom"></span>
                      <span className="domain-name">{getDomainDisplayName(domain)}</span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="domain-summary">
                <div className="summary-badge">
                  <span className="summary-icon">📊</span>
                  <span className="summary-text">
                    {selectedDomains.length} of {availableDomains.length} domains selected
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
