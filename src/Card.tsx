import React, { memo, useCallback } from "react";

import { Article } from "./types";
import TimeAgo from "react-timeago";

type CardProps = {
  article: Article;
  onDismiss: (() => void) | null;
  onUndoDismiss: (() => void) | null;
  isTop: boolean;
  ref: React.RefObject<HTMLDivElement | null> | null;
};

const Card = memo(
  ({ article, onDismiss, onUndoDismiss, isTop, ref }: CardProps) => {
    const openArticle = useCallback(() => {
      window.open(article.url, "_blank");
      onDismiss?.();
    }, [article.url, onDismiss]);

    const dismissArticle = useCallback(() => {
      onDismiss?.();
    }, [onDismiss]);

    return (
      <div
        ref={ref}
        className={`article-card group ${isTop ? "top-card" : "background-card"}`}
        style={{
          transform: `translate(${article.card.offset.x}px, ${
            article.card.offset.y
          }px) rotate(${isTop ? 0 : article.card.rotation}deg)`,
          zIndex: 100 - article.card.initialIndex,
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " ") {
            e.preventDefault();
            dismissArticle();
          }
          if (e.key === "Enter") {
            e.preventDefault();
            openArticle();
          }
          if (e.key === "Backspace") {
            e.preventDefault();
            onUndoDismiss?.();
          }
        }}
      >
        <h2 className="article-card-title">{article.title}</h2>
        <p className="article-card-byline">
          <TimeAgo date={new Date(article.date)} />
        </p>
        <div className="article-card-content">{article.text}</div>
        {isTop && (
          <div className="action-buttons">
            <button
              className="action-button"
              onClick={dismissArticle}
              title="Skip article"
            >
              Skip
            </button>

            <button
              className="action-button"
              onClick={openArticle}
              title="Read article"
            >
              Read
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default Card;
