import { useEffect, useRef, useState, useCallback } from "react";

import Card from "../Card";
import { ANIMATION_DURATION } from "../constants";
import { useKeyPress } from "../hooks/useKeyPress";
import { Article } from "../types";

type ArticlesProps = {
  articles: Article[];
  markRead: (id: string) => void;
  markUnread: () => void;
  onClearAll: () => void;
};

export function Articles({
  articles,
  markRead,
  markUnread,
  onClearAll,
}: ArticlesProps) {
  const topCardRef = useRef<HTMLDivElement>(null);
  const [isClearing, setIsClearing] = useState(false);
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
      window.removeEventListener("click", handleFocus);
    };
  }, []);

  const handleClearAll = useCallback(() => {
    setIsClearing(true);
    setTimeout(() => {
      onClearAll();
      setIsClearing(false);
    }, ANIMATION_DURATION);
  }, [onClearAll]);

  useKeyPress("Escape", handleClearAll);

  if (!articles.length) {
    return (
      <div className="placeholder-message">
        Seems like you have read everything there was to read. Check back later!
      </div>
    );
  }

  return (
    <div className={`article-stack ${isClearing ? "clearing" : ""}`}>
      {articles.map((article, index) => (
        <Card
          article={article}
          key={article.id}
          isTop={index === 0}
          onMarkRead={index === 0 ? () => markRead(article.id) : null}
          onMarkUnread={index === 0 ? markUnread : null}
          ref={index === 0 ? topCardRef : null}
          index={index}
        />
      ))}
    </div>
  );
}
