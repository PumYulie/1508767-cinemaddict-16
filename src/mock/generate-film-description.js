import {getRandomInteger} from '../utils/utils.js';

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

export {generateFilmDescription};
