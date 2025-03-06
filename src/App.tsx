import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Card from "./Card";
import { useArticles } from "./useArticles";

// Utility function to generate a random number within a range

const LoadingIndicator = () => {
  return (
    <div className="loading-container">
      <div className="loading-cards">
        <div
          className="loading-card"
          style={{ transform: "rotate(10deg)", marginLeft: "0px" }}
        ></div>
        <div
          className="loading-card"
          style={{ transform: "rotate(20deg)", marginLeft: "10px" }}
        ></div>
        <div
          className="loading-card"
          style={{ transform: "rotate(30deg)", marginLeft: "20px" }}
        ></div>
      </div>
    </div>
  );
};

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MainComponent />
    </QueryClientProvider>
  );
}

function MainComponent() {
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

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [topCardRef]);

  return (
    <div className="newspaper-container">
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <p>Error fetching articles!</p>
      ) : (
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
      )}
    </div>
  );
}

export default App;
