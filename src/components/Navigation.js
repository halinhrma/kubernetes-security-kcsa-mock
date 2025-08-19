import React from 'react';

function Navigation({ currentIndex, totalQuestions, onPrevious, onNext, onFlag, isFlagged, onStar, isStarred }) {
  return (
    <div className="navigation">
      <button
        className="nav-btn nav-prev"
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        Previous
      </button>

      <div className="nav-actions">
        <button
          className="nav-btn nav-star"
          onClick={onStar}
          title={isStarred ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isStarred ? '★' : '☆'} {isStarred ? 'Unstar' : 'Star'}
        </button>

        <button
          className="nav-btn nav-flag"
          onClick={onFlag}
        >
          {isFlagged ? 'Unflag' : 'Flag'} Question
        </button>
      </div>

      <button
        className="nav-btn nav-next"
        onClick={onNext}
      >
        {currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}

export default Navigation;