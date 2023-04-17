import BasicVerticalBarChart from '../components/charts/BasicVerticalBarChart.vue';
import BasicHorizontalBarChart from '../components/charts/BasicHorizontalBarChart.vue';
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
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  document.title = `Playground: ${to.name}`;
  next();
});

export default router;
