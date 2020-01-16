export const flatten = (array: any[]) => [].concat.apply([], array);

export const run = (init, ...funcs) =>
  funcs.reduce((prev, func) => func(prev), init);
