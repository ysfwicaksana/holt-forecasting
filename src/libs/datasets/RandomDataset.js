export default function RandomDataset(length, minRange, maxRange) {
  const dataset = [];
  let prevValue = null;
  for (let i = 0; i < length; i++) {
    let randomNumber =
      Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;

    if (prevValue !== null) {
      if (prevValue <= randomNumber) {
        randomNumber += prevValue;
      }
    }
    dataset.push({ value: randomNumber, label: `label ke-${i + 1}` });
    prevValue = randomNumber;
  }
  return dataset;
}
