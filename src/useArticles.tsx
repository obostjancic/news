import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

import { Article } from "./types";
import { useLocalStorage } from "./useLocalStorage";

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const useArticles = () => {
  const {
    data: allArticles = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/public/results`,
          {
            headers: {
              "X-API-Key": import.meta.env.VITE_API_KEY,
            },
          }
        );

        const fetchedArticles = response.data[0].slice().reverse().slice(0, 50);

        return fetchedArticles.map(
          (article: { data: Article }, index: number) => ({
            ...article.data,
            card: {
              rotation: index * randomInRange(0, 1),
              initialIndex: index,
              offset: {
                x: randomInRange(-5, 5),
                y: randomInRange(-5, 5),
              },
            },
          })
        ) as Article[];
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch articles");
      }
    },
  });

  const [dismissedArticles, setDismissedArticles] = useLocalStorage<string[]>(
    "dismissedArticles",
    []
  );

  const dismissArticle = useCallback(
    (idToRemove: string) => {
      setDismissedArticles((prevArticles) => [...prevArticles, idToRemove]);
    },
    [setDismissedArticles]
  );

  const undoDismissArticle = useCallback(() => {
    setDismissedArticles((prevArticles) => prevArticles.slice(0, -1));
  }, [setDismissedArticles]);

  const articles = allArticles.filter(
    (article) => !dismissedArticles.includes(article.id)
  );

  return {
    articles,
    loading,
    error,
    dismissArticle,
    undoDismissArticle,
  };
};
