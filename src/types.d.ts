export type Article = {
  id: string;
  title: string;
  text: string;
  url: string;
  date: string;
  card: {
    rotation: number;
    initialIndex: number;
    offset: {
      x: number;
      y: number;
    };
  };
};
