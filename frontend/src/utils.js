export const truncateText = (text) => {
  if (text === null) return null;
  return text.length >= 300 ? text.substring(0, 299) : text;
};
