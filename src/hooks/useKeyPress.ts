import { useCallback, useEffect } from "react";

type KeyPressHandler = (event: KeyboardEvent) => void;

export const useKeyPress = (key: string, handler: KeyPressHandler) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        event.preventDefault();
        handler(event);
      }
    },
    [key, handler]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};
