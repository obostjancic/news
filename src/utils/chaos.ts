export const failRandomly = (chance = 0.5, message = "Random failure") => {
  if (Math.random() < chance) {
    throw new Error(message);
  }
};
