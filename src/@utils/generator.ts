export const generateRandomColor = (): string => {
  const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
  return `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
};
