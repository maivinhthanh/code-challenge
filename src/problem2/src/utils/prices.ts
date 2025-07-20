export const fetchPrices = async (): Promise<Record<string, number>> => {
  const res = await fetch("https://interview.switcheo.com/prices.json");
  return res.json();
};