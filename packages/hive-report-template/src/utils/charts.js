import { sortBy } from "lodash";


export const concurrencyReport = txns => {
  const increaments = txns.map(t => ({ time: t.start, diff: 1 }));
  const decreaments = txns.map(t => ({ time: t.end, diff: -1 }));
  const combined = sortBy(increaments.concat(decreaments), "time");
  let counter = 0;
  return combined.map(c => {
    counter += c.diff;
    return { time: c.time, concurrency: counter };
  });
};

export const systematicSampling = (txns, k) => {
  return txns.reduce((prev, curr, index) => {
    if (index % k === 0) return prev.concat(curr);
    return prev;
  }, []);
}
