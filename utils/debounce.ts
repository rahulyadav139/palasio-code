export const debounce = (cb: Function, delay: number = 500) => {
  let timer: NodeJS.Timeout | null;

  return (...args: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      cb.apply(this, args);
    }, delay);
  };
};
