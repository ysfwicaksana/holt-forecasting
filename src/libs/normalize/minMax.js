export const minMaxNormalization = (data) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map((value) => (value - min) / (max - min));
};

export const minMaxDenormalization = (data, min, max) => {
  return data.map((value) => value * (max - min) + min);
};
