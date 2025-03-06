import { useCallback } from "react";
import { parseStringPromise } from "xml2js";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";
import { Article } from "./types";
import axios from "axios";

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const getVal = (obj: unknown) => {
  if (obj && typeof obj === "object") {
    if ("_" in obj) {
      return obj["_"] as string;
    }
  }

  return obj;
};

export const useArticles = () => {
  const {
    data: allArticles = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/jobs/6");

        const fetchedArticles = response.data;

        // const result = await parseStringPromise(text);
        // const fetchedArticles: Article[] = result.rss.channel[0].item.map(
        //   (article: Record<string, unknown[]>) => ({
        //     id: getVal(article.guid[0]),
        //     title: getVal(article.title[0]),
        //     content: getVal(article.description[0]),
        //     category: getVal(article.category[0]),
        //     link: getVal(article.link[0]),
        //   })
        // );

        return fetchedArticles.results.map(
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
