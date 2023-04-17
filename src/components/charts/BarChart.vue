<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';

const chart = ref(null);

const data = [
  { date: '2023-04-01', billable: 200, nonBillable: 50, billed: 100 },
  { date: '2023-04-02', billable: 500, nonBillable: 100, billed: 200 },
  { date: '2023-04-03', billable: 400, nonBillable: 150, billed: 0 },
  { date: '2023-04-04', billable: 500, nonBillable: 200, billed: 0 },
  { date: '2023-04-05', billable: 400, nonBillable: 250, billed: 350 },
  { date: '2023-04-06', billable: 800, nonBillable: 300, billed: 500 },
  { date: '2023-04-07', billable: 800, nonBillable: 350, billed: 600 },
  { date: '2023-04-08', billable: 1000, nonBillable: 400, billed: 0 },
  { date: '2023-04-09', billable: 350, nonBillable: 450, billed: 50 },
  { date: '2023-04-10', billable: 600, nonBillable: 500, billed: 150 },
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
  const margin = { top: 10, right: 30, bottom: 30, left: 60 };
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
  const billableData = data.map((d) => d.billable);
  const nonBillableData = data.map((d) => d.nonBillable);
  const maxY = d3.max([...billableData, ...nonBillableData]);
  const yTicks = 4;

  const y = d3.scaleLinear().domain([0, maxY]).range([height, 0]).nice(yTicks);

  const yAxis = d3.axisLeft(y).tickSize(0).ticks(yTicks);

  const yAxisGroup = svg.append('g').call(yAxis);

  yAxisGroup.select('.domain').remove();

  // main stuff to create the bars and set width/ positions n such
  const billableBars = svg
    .selectAll('.billable')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'billable')
    .attr('x', (d) => x(d.date) + 10)
    .attr('y', (d) => y(d.billable))
    .attr('width', 15)
    .attr('height', (d) => height - y(d.billable))
    .attr('rx', 8)
    .attr('fill', '#1976D2');

  const nonBillableBars = svg
    .selectAll('.nonbillable')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'nonbillable')
    .attr('x', (d) => x(d.date) + x.bandwidth() / 2 + 1)
    .attr('y', (d) => y(d.nonBillable))
    .attr('width', 15)
    .attr('height', (d) => height - y(d.nonBillable))
    .attr('rx', 8)
    .attr('fill', '#CFD8DC');

  const billedBars = svg
    .selectAll('.billed')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'billed')
    .attr('x', (d) => x(d.date) + 10)
    .attr('y', (d) => y(d.billed))
    .attr('width', 15)
    .attr('height', (d) => height - y(d.billed))
    .attr('rx', 8)
    .attr('fill', '#EC407A');

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
      <h2>D3.js - column and overlayed bar chart</h2>
      <div ref="chart"></div>
    </div>
  </section>
</template>
