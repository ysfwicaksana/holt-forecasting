export const minMaxNormalization = (data) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map((value) => (value - min) / (max - min));
};

export const getMin = (data) => Math.min(...data);
export const getMax = (data) => Math.max(...data);
