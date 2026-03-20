import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="typing-loader">
        <span className="typing-text">FreeSiksha.com</span>
      </div>
      <style>{`
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: #0f172a; /* Sleek dark background */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          font-family: 'Inter', sans-serif;
        }

        .typing-loader {
          font-size: 3rem;
          font-weight: 700;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          white-space: wrap;
          border-right: 4px solid #3b82f6; /* Cursor color */
          width: 0;
          animation: 
            typing 2s steps(12,end) forwards,
            blink 0.2s step-end infinite;
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 13ch } /* Approx length of FreeSiksha.com */
        }

        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: #3b82f6 }
        }

        @media (max-width: 768px) {
          .typing-loader {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
