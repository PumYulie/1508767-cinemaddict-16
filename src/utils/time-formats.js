import dayjs from 'dayjs';
import duration from 'dayjs/plagin/duration';
import relativeTime from 'dayjs/plagin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default class TimeFormat {
  static getDate = (date, wantedFormat) => dayjs(date).format(wantedFormat);

  static getHumanizedDate = (date) => {
    const currentDate = dayjs();
    const dateOfComment = dayjs(date);

    const seconds = currentDate.diff(dateOfComment, 'second');
    const minutes = currentDate.diff(dateOfComment, 'minute');
    const hours = currentDate.diff(dateOfComment, 'hour');
    const days = currentDate.diff(dateOfComment, 'day');
    const months = currentDate.diff(dateOfComment, 'month');
    const years = currentDate.diff(dateOfComment, 'year');

    if (seconds < 60) {
      return dayjs.duration(-seconds, 'second').humanize(true);
    }

    if (minutes >= 1 && minutes < 60) {
      return dayjs.duration(-minutes, 'minute').humanize(true);
    }

    if (hours >= 1 && hours < 24) {
      return dayjs.duration(-hours, 'hour').humanize(true);
    }

    if (days >= 1 && days < 30) {
      return dayjs.duration(-days, 'day').humanize(true);
    }

    if (months >= 1 && months < 12) {
      return dayjs.duration(-months, 'month').humanize(true);
    }

    return dayjs.duration(-years, 'year').humanize(true);
  };
}
