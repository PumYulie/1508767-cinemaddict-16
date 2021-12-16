// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const  getRandomFloat = (min = 1, max = 10) => {
  const decimalNumber = (Math.random() * (max - min) + min).toFixed(1);
  return decimalNumber;
};

const generateValueFromArray = (array) => {
  const index = getRandomInteger(0, array.length - 1);
  return array[index];
};

const generateArrayFromArray = (array, percent) => {
  const numberOfElements = getRandomInteger(1, Math.round(array.length * percent));
  const resultingArray = [];

  for (let i = 0; i < numberOfElements; i++) {
    const indexOfCurrentElement = getRandomInteger(0, array.length - 1);
    resultingArray.push(array[indexOfCurrentElement]);
  }

  return resultingArray;
};

const generateBoolean = () => Boolean(getRandomInteger(0, 1));


const generateFilmDescription = (descriptions, length) => {

  const randomNumberOfDescriptions = getRandomInteger(1, 5);
  const baseArray = [];

  for (let i = 0; i < randomNumberOfDescriptions; i++) {
    const randomIndex = getRandomInteger(0, descriptions.length - 1);
    baseArray.push(descriptions[randomIndex]);
  }

  let readyDescription = baseArray.join(' ');

  if (length && readyDescription.length > length) {
    readyDescription = readyDescription.slice(0, length - 1);
    readyDescription += '\u2026';
  }

  return readyDescription;
};


export {getRandomInteger, getRandomFloat, generateValueFromArray, generateArrayFromArray, generateBoolean, generateFilmDescription};
