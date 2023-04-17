<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';



const chart = ref(null);

// sample data for now
const data = [
  { label: 'Tasks', value: 35, color: '#FFCDD2' },
  { label: 'Projects', value: 17, color: '#E1BEE7' },
  { label: 'Milestones', value: 65, color: '#BBDEFB' },
  { label: 'Deadlines', value: 65, color: '#B2DFDB' },
  { label: 'Notifications', value: 65, color: '#FFECB3' },
];

onMounted(() => {
  const width = 650;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 160 };

  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([margin.top, height - margin.bottom])
    .padding(0.1);

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .nice()
    .range([margin.left, width - margin.right]);

  const svg = d3
    .select(chart.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  svg
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('y', (d) => y(d.label))
    .attr('x', (d) => x(5))
    .attr('width', (d) => x(d.value) - x(0))
    .attr('height', y.bandwidth())
    .attr('fill', (d) => d.color);

  // Add data.value text on the left of the bars
  svg
    .selectAll('text.value')
    .data(data)
    .join('text')
    .attr('class', 'value')
    .attr('y', (d) => y(d.label) + y.bandwidth() / 2)
    .attr('x', (d) => x(0) - 10) 
    .attr('text-anchor', 'start')
    .attr('fill', 'white')
    .attr('dominant-baseline', 'middle')
    .text((d) => d.value);

  svg
    .selectAll('text.label')
    .data(data)
    .join('text')
    .attr('class', 'label')
    .attr('y', (d) => y(d.label) + y.bandwidth() / 2)
    .attr('x', (d) => x(0) - 120) // Adjust this value to position the text to the left of the data.value text
    .attr('text-anchor', 'start')
    .attr('fill', 'white')
    .attr('dominant-baseline', 'middle')
    .text((d) => d.label);
});
</script>

<template>
  <section>
    <div class="flex-col text-center">
      <h2>D3.js - bar chart</h2>
      <div ref="chart"></div>
    </div>
  </section>
</template>
