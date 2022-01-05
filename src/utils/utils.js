
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

//возвращает массив актуальных моковых объектов фильмов
const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {updateItem, getRandomInteger, getRandomFloat, generateValueFromArray, generateArrayFromArray, generateBoolean};
