import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import Card from "./Card";
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
        {articles.length ? "Clear All" : "Bring All Back"}
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
        Press <kbd>u</kbd> to undo
        <br />
        Press <kbd>Enter</kbd> to read
        <br />
        Press <kbd>Backspace</kbd> to bring all articles back
        <br />
        Press <kbd>Escape</kbd> to clear all articles
      </div>
    </div>
  );
}

type ArticlesProps = {
  articles: Article[];
  markRead: (id: string) => void;
  markUnread: () => void;
};

function Articles({ articles, markRead, markUnread }: ArticlesProps) {
  const topCardRef = useRef<HTMLDivElement>(null);
  const topArticleId = articles[0]?.id;

  useEffect(() => {
    topCardRef.current?.focus();
  }, [topArticleId]);

  useEffect(() => {
    const handleFocus = () => {
      if (topCardRef.current) {
        topCardRef.current.focus();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("click", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.addEventListener("click", handleFocus);
    };
  }, [topCardRef]);

  if (!articles.length) {
    return (
      <div className="placeholder-message">
        Seems like you have read everything there was to read. Check back later!
      </div>
    );
  }

  return (
    <div className="article-stack">
      {articles.map((article, index) => (
        <Card
          article={article}
          key={article.id}
          isTop={index === 0}
          onMarkRead={index === 0 ? () => markRead(article.id) : null}
          onMarkUnread={index === 0 ? markUnread : null}
          ref={index === 0 ? topCardRef : null}
        />
      ))}
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

  useKeyPress("Escape", markAllRead);
  useKeyPress("Backspace", markAllUnread);

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
