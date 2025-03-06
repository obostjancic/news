import React, { memo } from "react";
import { Article } from "./types";

type CardProps = {
  article: Article;
  onDismiss: (() => void) | null;
  isTop: boolean;
  ref: React.RefObject<HTMLDivElement | null> | null;
};

const Card = memo(({ article, onDismiss, isTop, ref }: CardProps) => {
  console.log("rendering", article.title);
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
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDismiss?.();
        }
      }}
    >
      <h2 className="article-card-title">{article.title}</h2>
      <p className="article-card-byline"></p>
      <div className="article-card-content">{article.text}</div>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="article-card-link"
      >
        Read full article
      </a>
    </div>
  );
});

export default Card;
