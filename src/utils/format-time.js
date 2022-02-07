import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);
const TIME_PERIOD = {
  SECONDS: {
    MAX: 60
  },
  MINUTES: {
    MIN: 1,
    MAX: 60
  },
  HOURS: {
    MIN: 1,
    MAX: 24
  },
  DAYS: {
    MIN: 1,
    MAX: 30
  },
  MONTHS: {
    MIN: 1,
    MAX: 12
  },
};
export default class FormatTime {
  static getDate = (someDate, format) => dayjs(someDate).format(format);

  static getHumanizeDate = (date) => {
    const dateNow = dayjs();
    const dateComment = dayjs(date);
    const seconds = dateNow.diff(dateComment, 'second');
    const minutes = dateNow.diff(dateComment, 'minute');
    const hours = dateNow.diff(dateComment, 'hour');
    const days = dateNow.diff(dateComment, 'day');
    const months = dateNow.diff(dateComment, 'month');
    const years = dateNow.diff(dateComment, 'year');
    if (seconds < TIME_PERIOD.SECONDS.MAX) {
      return dayjs.duration(-seconds, 'second').humanize(true);
    }
    if (minutes >= TIME_PERIOD.MINUTES.MIN && minutes < TIME_PERIOD.MINUTES.MAX) {
      return dayjs.duration(-minutes, 'minute').humanize(true);
    }
    if (hours >= TIME_PERIOD.HOURS.MIN && hours < TIME_PERIOD.HOURS.MAX) {
      return dayjs.duration(-hours, 'hour').humanize(true);
    }
    if (days >= TIME_PERIOD.DAYS.MIN && days <= TIME_PERIOD.DAYS.MAX) {
      return dayjs.duration(-days, 'day').humanize(true);
    }
    if (months >= TIME_PERIOD.MONTHS.MIN && months <= TIME_PERIOD.MONTHS.MAX) {
      return dayjs.duration(-months, 'month').humanize(true);
    }
    return dayjs.duration(-years, 'year').humanize(true);
  }
}
