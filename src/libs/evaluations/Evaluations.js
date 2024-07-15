export const RMSE = (data) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += Math.pow(data[i] - data[i + 1], 2);
  }
  return Math.sqrt(sum / data.length);
};
