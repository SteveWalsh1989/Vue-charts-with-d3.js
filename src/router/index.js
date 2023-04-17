import BasicVerticalBarChart from '../components/charts/BasicVerticalBarChart.vue';
import BasicHorizontalBarChart from '../components/charts/BasicHorizontalBarChart.vue';
import BarChart from '../components/charts/BarChart.vue';
import ChartAndLineGraph from '../components/charts/ChartAndLineGraph.vue';

import { createRouter, createWebHistory } from 'vue-router';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: BasicVerticalBarChart,
  },
  {
    path: '/vertical-bar-chart',
    name: 'Vertical Charts',
    component: BasicVerticalBarChart,
  },
  {
    path: '/horizontal-bar-chart',
    name: 'Horizontal Charts',
    component: BasicHorizontalBarChart,
  },
  {
    path: '/bar-chart',
    name: 'Bar Charts',
    component: BarChart,
  },
  {
    path: '/chart-with-line-graph',
    name: 'Chart with line graph',
    component: ChartAndLineGraph,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  document.title = `Charts: ${to.name}`;
  next();
});

export default router;
