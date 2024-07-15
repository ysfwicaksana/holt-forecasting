export const DesHolt = (data, alpha, beta, predictSteps = null) => {
  let normalizeDump = [];
  let levelDump = [];
  let trendDump = [];
  let forecastDump = [];
  let errorDump = [];

  for (let i = 0; i < data.length; i++) {
    normalizeDump.push(data[i]);

    if (i == 0) {
      levelDump.push(0);
      trendDump.push(0);
      forecastDump.push(0);
      forecastDump.push(0);
      errorDump.push(0);
    } else if (i == 1) {
      levelDump.push(data[1]);
      trendDump.push(data[1] - data[0]);
      forecastDump.push(levelDump[1] + trendDump[1]);
      errorDump.push(0);
    } else {
      let level =
        alpha * data[i] + (1 - alpha) * (levelDump[i - 1] + trendDump[i - 1]);

      let trend =
        beta * (level - levelDump[i - 1]) + (1 - beta) * trendDump[i - 1];

      levelDump.push(level);
      trendDump.push(trend);
      forecastDump.push(level + trend);
      errorDump.push(data[i] - forecastDump[i]);
    }
  }

  //lets predict the future
  let predictDump = [];

  if (predictSteps) {
    const trendPredict = trendDump[trendDump.length - 1];
    for (let i = 0; i < predictSteps; i++) {
      if (i == 0) {
        predictDump.push(trendPredict + forecastDump[forecastDump.length - 1]);
      } else {
        predictDump.push(trendPredict + predictDump[i - 1]);
      }
    }
  }

  //join the result
  let result = [];
  forecastDump.forEach((value, i) => {
    result.push({
      normalize: normalizeDump[i],
      level: levelDump[i],
      trend: trendDump[i],
      forecast: value,
      error: errorDump[i],
    });
  });

  //calculate RMSE
  let sum = 0;
  for (let i = 0; i < errorDump.length; i++) {
    sum += errorDump[i];
  }

  let RMSE = Math.sqrt(sum / errorDump.length);

  return {
    result,
    predictSteps,
    predictDump,
    RMSE,
  };
};
