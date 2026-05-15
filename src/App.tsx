import { useState } from 'react';
import './styles/globals.css';
import { useLetters } from './hooks/useLetters';
import { useNow } from './hooks/useNow';
import type { CreateLetterDTO } from './types/letter';
import LetterCard from './components/LetterCard/LetterCard';
import LetterForm from './components/LetterForm/LetterForm';
import EmptyState from './components/EmptyState/EmptyState';
import DeleteConfirm from './components/DeleteConfirm/DeleteConfirm';

function App() {
  const { letters, addLetter, deleteLetter, updateLetterStatus } = useLetters();
  const now = useNow();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<string | null>(null);

  const handleCreateLetter = (dto: CreateLetterDTO) => {
    addLetter(dto);
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (letterToDelete) {
      deleteLetter(letterToDelete);
      setLetterToDelete(null);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo animate-float">
          <span className="logo-icon">⏳</span>
          <h1>Time-Locked Letters</h1>
        </div>
        <button 
          className="create-btn"
          onClick={() => setIsFormOpen(true)}
        >
          + New Letter
        </button>
      </header>

      <main className="app-main">
        {letters.length === 0 ? (
          <EmptyState onCreateClick={() => setIsFormOpen(true)} />
        ) : (
          <div className="letter-grid">
            {letters.map((letter) => (
              <LetterCard
                key={letter.id}
                letter={letter}
                now={now}
                onDelete={(id) => setLetterToDelete(id)}
                onStatusUpdate={updateLetterStatus}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Patience as a product. &copy; {new Date().getFullYear()}</p>
      </footer>

      {isFormOpen && (
        <LetterForm 
          onSubmit={handleCreateLetter} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {letterToDelete && (
        <DeleteConfirm 
          onConfirm={handleDeleteConfirm} 
          onCancel={() => setLetterToDelete(null)} 
        />
      )}

      <style>{`
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--color-border);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          font-size: 2.5rem;
        }

        .logo h1 {
          font-size: 2rem;
          letter-spacing: -0.02em;
          background: linear-gradient(to right, var(--color-paper), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .create-btn {
          background: var(--color-accent);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);
        }

        .create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.4);
        }

        .app-main {
          flex: 1;
        }

        .letter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .app-footer {
          margin-top: 4rem;
          text-align: center;
          padding: 2rem 0;
          color: var(--color-text-dim);
          font-size: 0.875rem;
          border: 1px solid var(--color-border);
        }

        @media (max-width: 640px) {
          .app-container {
            padding: 1rem;
          }
          .app-header {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }
          .letter-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
