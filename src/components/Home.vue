<script setup>
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
];
</script>

<template>
  <div>
    <div class="mx-4 my-12 text-center">
      <router-link
        v-for="link in links"
        :key="link.id"
        :to="link.link"
        class="border border-slate-200 rounded-xl p-4 mr-8 hover:bg-slate-700"
        >{{ link.title }}</router-link
      >
    </div>
    <RouterView />
  </div>
</template>
