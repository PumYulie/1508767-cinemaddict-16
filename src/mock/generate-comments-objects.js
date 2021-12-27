import {EMOJIS, COMMENT_AUTHORS, COMMENT_MESSAGES} from './constants.js';
import {getRandomInteger, generateValueFromArray} from '../utils/utils.js';
import dayjs from 'dayjs';


const generateCommentDate = () => {
  const minutesAgo = getRandomInteger(0, 719);
  const daysAgo = getRandomInteger(0, 1825);

  const commentDate = dayjs()
    .subtract(daysAgo, 'day')
    .subtract(minutesAgo, 'minute')
    .format('YYYY/MM/DD HH:mm');

  return commentDate;
};


const generateCommentsObjects = (number) => {
  const commentsArray = [];

  for (let i = 0; i < number; i++) {
    const newCommentObj = {
      emoji: generateValueFromArray(EMOJIS),
      date: generateCommentDate(),
      author: generateValueFromArray(COMMENT_AUTHORS),
      message: generateValueFromArray(COMMENT_MESSAGES),
    };
    commentsArray.push(newCommentObj);
  }

  return commentsArray;
};


export {generateCommentsObjects};
