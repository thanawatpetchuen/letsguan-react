export const totalTime = (start: Date, end: Date) => {
  if (!start && !end) {
    return "";
  }
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const d = new Date(0, 0, 0, 0, 0, 0, diff);
  return `${d.getMinutes()}.${d.getSeconds()} mins`;
};
