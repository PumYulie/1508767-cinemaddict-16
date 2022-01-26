import {EMOJIS, COMMENT_AUTHORS, COMMENT_MESSAGES} from './constants.js';
import {getRandomInteger, generateValueFromArray} from '../utils/utils.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';


const generateCommentDate = (maxMinsAgo, maxDaysAgo) => {
  const minutesAgo = getRandomInteger(0, maxMinsAgo);
  const daysAgo = getRandomInteger(0, maxDaysAgo);

  const commentDate = dayjs()
    .subtract(daysAgo, 'day')
    .subtract(minutesAgo, 'minute')
    .format('YYYY/MM/DD HH:mm');

  return commentDate;
};

const generateComment = (emoji, message) => ({
  id: nanoid(),
  emoji: emoji,
  date: generateCommentDate(3, 0),
  author: generateValueFromArray(COMMENT_AUTHORS),
  message: message,
});

const generateCommentsObjects = (number) => {
  const commentsArray = [];

  for (let i = 0; i < number; i++) {
    const newCommentObj = {
      id: nanoid(),
      emoji: generateValueFromArray(EMOJIS),
      date: generateCommentDate(719, 1825),
      author: generateValueFromArray(COMMENT_AUTHORS),
      message: generateValueFromArray(COMMENT_MESSAGES),
    };
    commentsArray.push(newCommentObj);
  }

  return commentsArray;
};


export {generateComment, generateCommentsObjects};
