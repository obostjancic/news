import React, { memo, useCallback, useState, useRef, useEffect } from "react";
import TimeAgo from "react-timeago";

import { ANIMATION_DURATION } from "./constants";
import { useKeyPress } from "./hooks/useKeyPress";
import { Article } from "./types";

type CardProps = {
  article: Article;
  onMarkRead: (() => void) | null;
  onMarkUnread: (() => void) | null;
  isTop: boolean;
  ref: React.RefObject<HTMLDivElement | null> | null;
  index: number;
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
    const timeoutRef = useRef<number>(0);

    const openArticle = useCallback(() => {
      window.open(article.url, "_blank");
      onMarkRead?.();
    }, [article.url, onMarkRead]);

    const markRead = useCallback(() => {
      if (isTop) {
        setSlideDirection(getRandomDirection());
        setIsRead(true);
        // Delay the actual markRead call until after the animation
        timeoutRef.current = window.setTimeout(() => {
          onMarkRead?.();
        }, ANIMATION_DURATION);
      }
    }, [isTop, onMarkRead]);

    // Cleanup timeout on unmount or when isTop changes
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }, [isTop]);

    useKeyPress(" ", markRead);
    useKeyPress("Enter", openArticle);
    useKeyPress("Backspace", () => onMarkUnread?.());

    const style = {
      transform: `translate(${article.card.offset.x}px, ${
        article.card.offset.y
      }px) rotate(${isTop ? 0 : article.card.rotation}deg)`,
      zIndex: 100 - article.card.initialIndex,
      "--initial-rotation": `${article.card.rotation}deg`,
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
  },
  (prevProps, nextProps) => {
    // Only re-render if:
    // 1. The card becomes top or stops being top
    // 2. The article data changes
    // 3. The callbacks change
    return (
      prevProps.isTop === nextProps.isTop &&
      prevProps.article === nextProps.article &&
      prevProps.onMarkRead === nextProps.onMarkRead &&
      prevProps.onMarkUnread === nextProps.onMarkUnread
    );
  }
);

export default Card;
