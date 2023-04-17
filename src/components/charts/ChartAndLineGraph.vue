<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';

const chart = ref(null);

const data = [
  {
    date: '2023-04-01',
    leftOvers: 200,
    goneOff: 50,
    eaten: 100,
    capacity: 300,
  },
  {
    date: '2023-04-02',
    leftOvers: 500,
    goneOff: 100,
    eaten: 200,
    capacity: 300,
  },
  { date: '2023-04-03', leftOvers: 400, goneOff: 150, eaten: 0, capacity: 300 },
  { date: '2023-04-04', leftOvers: 500, goneOff: 200, eaten: 0, capacity: 500 },
  {
    date: '2023-04-05',
    leftOvers: 400,
    goneOff: 250,
    eaten: 350,
    capacity: 500,
  },
  {
    date: '2023-04-06',
    leftOvers: 800,
    goneOff: 300,
    eaten: 500,
    capacity: 800,
  },
  {
    date: '2023-04-07',
    leftOvers: 800,
    goneOff: 350,
    eaten: 600,
    capacity: 800,
  },
  {
    date: '2023-04-08',
    leftOvers: 1000,
    goneOff: 400,
    eaten: 0,
    capacity: 800,
  },
  {
    date: '2023-04-09',
    leftOvers: 350,
    goneOff: 450,
    eaten: 50,
    capacity: 800,
  },
  {
    date: '2023-04-10',
    leftOvers: 600,
    goneOff: 500,
    eaten: 150,
    capacity: 800,
  },
];

// taken from other project just for date formatting here
function getOrdinalSuffix(day) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const relevantDigits = day < 30 ? day % 20 : day % 30;
  const suffixIndex = relevantDigits <= 3 ? relevantDigits : 0;
  return suffixes[suffixIndex];
}
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const options = { month: 'long' };
  const month = date.toLocaleDateString('en-US', options);
  const formattedDate = `${day}${getOrdinalSuffix(day)} ${month}`;
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
  const eatenBars = svg
    .selectAll('.eaten')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'eaten')
    .attr('x', (d) => x(d.date) + 10)
    .attr('y', (d) => y(d.eaten))
    .attr('width', 15)
    .attr('height', (d) => height - y(d.eaten))
    .attr('rx', 4)
    .attr('fill', '#C5CAE9');

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 2);

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
