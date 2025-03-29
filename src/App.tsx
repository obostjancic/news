import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Articles } from "./components/Articles";
import { useArticles } from "./hooks/useArticles";
import { useKeyPress } from "./hooks/useKeyPress";
import LoadingIndicator from "./LoadingIndicator";
import { Article } from "./types";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

function MobileActions({
  markAllRead,
  markAllUnread,
  articles,
}: {
  markAllRead: () => void;
  markAllUnread: () => void;
  articles: Article[];
}) {
  return (
    <div className="mobile-actions">
      <button
        onClick={articles.length ? markAllRead : markAllUnread}
        className="mobile-action-button"
      >
        {articles.length ? "Clear All" : "See old articles"}
      </button>
    </div>
  );
}

function KeyboardInstructions() {
  return (
    <div className="instruction-message">
      <div className="keyboard-instructions">
        <strong>Keyboard:</strong>
        <br />
        Press <kbd>Space</kbd> to skip an article
        <br />
        Press <kbd>Backspace</kbd> to undo
        <br />
        Press <kbd>Enter</kbd> to read
        <br />
        Press <kbd>r</kbd> to see old articles
        <br />
        Press <kbd>Escape</kbd> to clear all articles
      </div>
    </div>
  );
}

function AppContent() {
  const {
    articles,
    loading,
    error,
    markRead,
    markUnread,
    markAllRead,
    markAllUnread,
  } = useArticles();

  useKeyPress("r", markAllUnread);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <p className="error-message">Error fetching articles!</p>;
  }

  return (
    <div className="newspaper-container">
      <Articles
        articles={articles}
        markRead={markRead}
        markUnread={markUnread}
        onClearAll={markAllRead}
      />
      <KeyboardInstructions />
      <MobileActions
        markAllRead={markAllRead}
        markAllUnread={markAllUnread}
        articles={articles}
      />
    </div>
  );
}

export default App;
