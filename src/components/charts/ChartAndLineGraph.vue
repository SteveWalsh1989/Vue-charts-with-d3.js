<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';

const chart = ref(null);

const data = [
  {
    date: '2023-1-12',
    leftOvers: 200,
    goneOff: 50,
    capacity: 300,
  },
  {
    date: '2023-2-13',
    leftOvers: 500,
    goneOff: 100,
    capacity: 300,
  },
  { date: '2023-3-14', leftOvers: 400, goneOff: 150, capacity: 300 },
  { date: '2023-4-15', leftOvers: 500, goneOff: 200, capacity: 500 },
  {
    date: '2023-5-16',
    leftOvers: 400,
    goneOff: 250,
    capacity: 500,
  },
  {
    date: '2023-6-17',
    leftOvers: 800,
    goneOff: 300,
    capacity: 700,
  },
  {
    date: '2023-7-18',
    leftOvers: 800,
    goneOff: 350,
    capacity: 700,
  },
  {
    date: '2023-8-19',
    leftOvers: 1000,
    goneOff: 400,
    capacity: 700,
  },
  {
    date: '2023-9-20',
    leftOvers: 350,
    goneOff: 450,
    capacity: 700,
  },
  {
    date: '2023-10-21',
    leftOvers: 600,
    goneOff: 500,
    capacity: 700,
  },
];

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const formattedDate = `${month}`;
  return formattedDate;
}

// building up the chart
onMounted(() => {
  const margin = { top: 10, right: 60, bottom: 30, left: 30 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select(chart.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map((d) => d.date))
    .padding(0.1);

  // creating the amount y-axis
  const leftOversData = data.map((d) => d.leftOvers);
  const goneOffData = data.map((d) => d.goneOff);
  const maxY = d3.max([...leftOversData, ...goneOffData]);
  const yTicks = 4;

  const y = d3.scaleLinear().domain([maxY, 0]).range([0, height]).nice(yTicks);

  const yAxis = d3
    .axisRight(y)
    .tickSizeInner(-width + margin.left + margin.right - 65)
    .tickSizeOuter(0)
    .ticks(yTicks);

  const yAxisGroup = svg
    .append('g')
    .call(yAxis)
    .attr('transform', `translate(${width - margin.right + 50},0)`);

  yAxisGroup.select('.domain').remove();

  // add in line graph
  const capacityData = data.map((d) => d.capacity);
  const maxCapacity = d3.max(capacityData);
  const capacityY = d3
    .scaleLinear()
    .domain([0, maxCapacity])
    .range([height, 0])
    .nice(yTicks);
  const capacityLine = d3
    .line()
    .x((d) => x(d.date) + x.bandwidth() / 2 + 1)
    .y((d) => capacityY(d.capacity));

  // main stuff to create the bars and set width/ positions n such
  const leftOversBars = svg
    .selectAll('.leftOvers')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'leftOvers')
    .attr('x', (d) => x(d.date) + 10)
    .attr('y', (d) => y(d.leftOvers))
    .attr('width', 15)
    .attr('height', (d) => height - y(d.leftOvers))
    .attr('rx', 4)
    .attr('fill', '#303F9F');

  const goneOffBars = svg
    .selectAll('.goneOff')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'goneOff')
    .attr('x', (d) => x(d.date) + x.bandwidth() / 2 + 1)
    .attr('y', (d) => y(d.goneOff))
    .attr('width', 15)
    .attr('height', (d) => height - y(d.goneOff))
    .attr('rx', 4)
    .attr('fill', '#D32F2F');

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-dasharray', '5 5')
    .attr('stroke-width', 2)
    .attr('d', capacityLine);
  // creating the custom part of date x-axis
  const xAxis = d3
    .axisBottom(x)
    .tickSize(0)
    .tickFormat((d) => formatDate(d));

  const xAxisGroup = svg
    .append('g')
    .attr('transform', `translate(0,${height + margin.top})`)
    .call(xAxis);
  xAxisGroup.select('.domain').remove();
});
</script>

<template>
  <section class="flex">
    <div class="flex-col text-center mx-auto border border-solid rounded">
      <h2 class="my-4">Chart and line graph</h2>
      <div ref="chart"></div>
      <div id="tooltip" style="position: absolute; opacity: 0"></div>
    </div>
  </section>
</template>
