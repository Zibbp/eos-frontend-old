export const timestampToSeconds = (timestamp: string): number => {
  let parts = timestamp.split(":").map((val) => parseInt(val));
  let seconds = 0;
  if (parts.length === 3) {
    seconds += parts[0] * 60 * 60;
    seconds += parts[1] * 60;
    seconds += parts[2];
  } else {
    seconds += parts[0] * 60;
    seconds += parts[1];
  }
  return seconds;
};
