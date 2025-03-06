import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";
import { Article } from "./types";
import axios from "axios";

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
        const response = await axios.get("http://localhost:3000/api/jobs/1");

        return response.data.results.map(
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

  const articles = allArticles.filter(
    (article) => !dismissedArticles.includes(article.id)
  );

  return {
    articles,
    loading,
    error,
    dismissArticle,
  };
};
