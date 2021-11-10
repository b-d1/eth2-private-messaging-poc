export const getUTCtimestampByMinute = (): string => {
  const time = new Date();
  const minute = time.getUTCMinutes();

  time.setUTCMinutes(minute);
  time.setUTCSeconds(0);
  time.setUTCMilliseconds(0);

  const timeMs = time.getTime();

  return timeMs.toString();
};

export const sleep = async (seconds: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
};
