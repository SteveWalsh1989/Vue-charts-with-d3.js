<script setup>
import { ref } from 'vue';
const links = [
  {
    id: 1,
    title: 'Basic Vertical Bar Chart',
    link: '/vertical-bar-chart',
  },
  {
    id: 2,
    title: 'Basic Horizontal Bar Chart',
    link: '/horizontal-bar-chart',
  },
  {
    id: 3,
    title: 'Vertical Bar Chart',
    link: '/bar-chart',
  },
  {
    id: 4,
    title: 'Bar chart with line graph',
    link: '/chart-with-line-graph',
  },
];

const selected = ref(1);

function setSelected(id) {
  selected.value = id;
}
</script>

<template>
  <div>
    <div class="mx-4 my-12 text-center">
      <router-link
        v-for="link in links"
        :key="link.id"
        :to="link.link"
        class="border border-slate-200 rounded-xl p-4 mr-8 hover:bg-slate-700"
        :class="{ 'bg-slate-700 text-white': selected === link.id }"
        @click="setSelected(link.id)"
        >{{ link.title }}</router-link
      >
    </div>
    <RouterView />
  </div>
</template>
