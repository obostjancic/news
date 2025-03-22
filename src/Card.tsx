import React, { memo, useCallback, useState } from "react";
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

const getRandomDirection = () => {
  const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
  const distance = 100 + Math.random() * 100; // Random distance between 100 and 200px
  const rotation = -30 + Math.random() * 60; // Random rotation between -30 and 30 degrees

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    rotation,
  };
};

const Card = memo(
  ({ article, onMarkRead, onMarkUnread, isTop, ref }: CardProps) => {
    const [isRead, setIsRead] = useState(false);
    const [slideDirection, setSlideDirection] = useState<{
      x: number;
      y: number;
      rotation: number;
    } | null>(null);

    const openArticle = useCallback(() => {
      window.open(article.url, "_blank");
      onMarkRead?.();
    }, [article.url, onMarkRead]);

    const markRead = useCallback(() => {
      if (isTop) {
        setSlideDirection(getRandomDirection());
        setIsRead(true);
        // Delay the actual markRead call until after the animation
        setTimeout(() => {
          onMarkRead?.();
        }, 300);
      }
    }, [isTop, onMarkRead]);

    useKeyPress(" ", markRead);
    useKeyPress("Enter", openArticle);
    useKeyPress("u", () => onMarkUnread?.());

    const style = {
      transform: `translate(${article.card.offset.x}px, ${
        article.card.offset.y
      }px) rotate(${isTop ? 0 : article.card.rotation}deg)`,
      zIndex: 100 - article.card.initialIndex,
      ...(slideDirection &&
        ({
          "--slide-x": `${slideDirection.x}px`,
          "--slide-y": `${slideDirection.y}px`,
          "--slide-rotation": `${slideDirection.rotation}deg`,
        } as React.CSSProperties)),
    };

    return (
      <div
        ref={ref}
        className={`article-card group ${isTop ? "top-card" : "background-card"} ${isRead ? "read" : ""}`}
        style={style}
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
