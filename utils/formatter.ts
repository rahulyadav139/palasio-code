export const dateFormatter = (date: Date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
    day: '2-digit',
    minute: '2-digit',
    hour: '2-digit',
  });
};
