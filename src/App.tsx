import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import Card from "./Card";
import LoadingIndicator from "./LoadingIndicator";
import { useArticles } from "./useArticles";



function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="newspaper-container">
        <Articles />
        <div className="instruction-message">
          Press <kbd>Space</kbd> to dismiss an article
          <br />
          Press <kbd>Enter</kbd> to read the source article
        </div>
      </div>
    </QueryClientProvider>
  );
}

function Articles() {
  const topCardRef = useRef<HTMLDivElement>(null);
  const { articles, loading, error, dismissArticle } = useArticles();

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

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <p className="error-message">Error fetching articles!</p>;
  }

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
          onDismiss={index === 0 ? () => dismissArticle(article.id) : null}
          ref={index === 0 ? topCardRef : null}
        />
      ))}
    </div>
  );
}

export default App;
