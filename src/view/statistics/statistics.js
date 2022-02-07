import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from '../smart-view.js';
import {StatisticsType} from '../../consts.js';
import {getGenres, filmsToFilterMap} from '../../utils/statistics.js';
import {createStatsScreenTemplate} from './statistics-tpl.js';
const CHART_VALUE = {
  TYPE: 'horizontalBar',
  BACKGROUND_COLOR: '#ffe800',
  ANCOR: 'start',
  THICKNESS: 24,
  FONT_SIZE: 20,
  FONT_COLOR: '#fff',
  OFFSET: 40,
  PADDING: 100,
  HEIGHT: 50,
};
const renderChart = (chartContainer, films) => {
  const BAR_HEIGHT = CHART_VALUE.HEIGHT;
  const genres = [];
  const genresCounts = [];
  Object
    .entries(getGenres(films))
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, count]) => {
      genres.push(name);
      genresCounts.push(count);
    });
  chartContainer.height = BAR_HEIGHT * Object.values(genres).length;
  return new Chart(chartContainer, {
    plugins: [ChartDataLabels],
    type: CHART_VALUE.TYPE,
    data: {
      labels: genres,
      datasets: [{
        data: genresCounts,
        backgroundColor: CHART_VALUE.BACKGROUND_COLOR,
        hoverBackgroundColor: CHART_VALUE.BACKGROUND_COLOR,
        anchor: CHART_VALUE.ANCOR,
        barThickness: CHART_VALUE.THICKNESS,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: CHART_VALUE.FONT_SIZE,
          },
          color: CHART_VALUE.FONT_COLOR,
          anchor: CHART_VALUE.ANCOR,
          align: CHART_VALUE.ANCOR,
          offset: CHART_VALUE.OFFSET,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: CHART_VALUE.FONT_COLOR,
            padding: CHART_VALUE.PADDING,
            fontSize: CHART_VALUE.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });};
export default class Statistics extends SmartView {
  #chart = null;
  #films = null;
  #currentFilter = null;
  #watchedFilms = null;
  #data = null;
  #filters = null;
  constructor(films) {
    super();
    this.#films = films;
    this.#currentFilter = StatisticsType.ALL;
    this.#filters = this.#getFilters();
    this.#watchedFilms = this.#films.filter((film) => film['user_details']['already_watched']);
    this.#data = filmsToFilterMap[this.#currentFilter](this.#watchedFilms);
    this.setStatsFilterChangeHandler();
  }

  get template() {
    return createStatsScreenTemplate(this.#data, this.#currentFilter, this.#filters, this.#watchedFilms);
  }

  removeElement = () => {
    super.removeElement();
  }

  restoreHandlers = () => {
    this.setStatsFilterChangeHandler();
    this.getCharts();
  }

  getCharts = () => {
    if (this.#chart !== null) {
      this.#chart = null;
    }
    const chartContainer = document.querySelector('.statistic__chart');
    this.#chart = renderChart(chartContainer, this.#data);
  }

  setStatsFilterChangeHandler() {
    this.element.addEventListener('change', this.#filterItemsChangeHandler);
  }

  #filterItemsChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.classList.contains('statistic__filters-input')) {
      this.#currentFilter = evt.target.value;
      this.#data = filmsToFilterMap[this.#currentFilter](this.#watchedFilms);
      this.updateElement();
    }
  }

  #getFilters = () => [
    {
      type: StatisticsType.ALL,
      name: 'All time'
    },
    {
      type: StatisticsType.TODAY,
      name: 'Today'
    },
    {
      type: StatisticsType.WEEK,
      name: 'Week'
    },
    {
      type: StatisticsType.MONTH,
      name: 'Month'
    },
    {
      type: StatisticsType.YEAR,
      name: 'Year'
    }
  ]
}
