import React, { memo, useCallback } from "react";
import TimeAgo from "react-timeago";

import { useKeyPress } from "./hooks/useKeyPress";
import { Article } from "./types";

type CardProps = {
  article: Article;
  onMarkRead: (() => void) | null;
  onMarkUnread: (() => void) | null;
  isTop: boolean;
  ref: React.RefObject<HTMLDivElement | null> | null;
};

const Card = memo(
  ({ article, onMarkRead, onMarkUnread, isTop, ref }: CardProps) => {
    const openArticle = useCallback(() => {
      window.open(article.url, "_blank");
      onMarkRead?.();
    }, [article.url, onMarkRead]);

    const markRead = useCallback(() => {
      onMarkRead?.();
    }, [onMarkRead]);

    useKeyPress(" ", markRead);
    useKeyPress("Enter", openArticle);
    useKeyPress("u", () => onMarkUnread?.());

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
              onClick={markRead}
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
