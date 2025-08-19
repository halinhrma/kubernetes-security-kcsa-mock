import React from 'react';

function Question({ question, onAnswer, userAnswer, onStar, isStarred }) {
  if (!question) {
    return (
      <div className="question">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    );
  }

  // Removed unused local 'options' variable and try-catch

  const handleOptionChange = (optionIndex) => {
    // Ensure userAnswer is treated as an array for consistency
    const currentAnswer = Array.isArray(userAnswer) ? userAnswer : [];

    if (question.question_type === 'single-choice') {
      onAnswer(question.id, [optionIndex]); // Send as array even for single choice
    } else {
      // Handle multiple choice (checkboxes)
      const newAnswer = currentAnswer.includes(optionIndex)
        ? currentAnswer.filter((index) => index !== optionIndex) // Remove if exists
        : [...currentAnswer, optionIndex]; // Add if doesn't exist
      onAnswer(question.id, newAnswer.sort((a, b) => a - b)); // Keep sorted for consistency if needed
    }
  };

  const handleStar = () => {
    onStar(question.id);
  };

  // Ensure question.options is an array before mapping
  const optionsList = Array.isArray(question.options) ? question.options : [];
  // Ensure userAnswer is always an array for checking 'includes'
  const checkedAnswers = Array.isArray(userAnswer) ? userAnswer : [];

  return (
    <div className="question">
      <div className="question-header">
        <h2>{question.question}</h2>
        <button 
          className={`star-button ${isStarred ? 'starred' : ''}`}
          onClick={handleStar}
          aria-label={isStarred ? 'Remove from favorites' : 'Add to favorites'}
          title={isStarred ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isStarred ? '★' : '☆'}
        </button>
      </div>
      <form>
        {optionsList.map((option, index) => (
          <div key={index}>
            <label>
              <input
                type={question.question_type === 'single-choice' ? 'radio' : 'checkbox'}
                name={`question-${question.id}`} // Name helps group radio buttons
                value={index}
                checked={checkedAnswers.includes(index)} // Use guaranteed array
                onChange={() => handleOptionChange(index)}
              />
              {option}
            </label>
          </div>
        ))}
      </form>
    </div>
  );
}

export default Question;
