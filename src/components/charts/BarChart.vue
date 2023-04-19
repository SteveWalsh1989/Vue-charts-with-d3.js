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

function getTooltip(data) {
  return `
  <div class="flex flex-col p-2 border rounded">
    <div class="flex items-center" >
      <div class="w-2 h-2 rounded-full bg-[#1976D2] mr-2"></div>
      <span class="text-left mr-8">Billable:</span>
      <span class="ml-auto">${data.billable}</span>
    </div>
    <div class="flex items-center" >
      <div class="w-2 h-2 rounded-full bg-[#EC407A] mr-2"></div>
      <span class="text-left mr-8">Billed:</span>
      <span class="ml-auto">${data.billed}</span>
    </div>
    <div class="flex items-center" >
      <div class="w-2 h-2 rounded-full bg-[#CFD8DC] mr-2"></div>
      <span class="text-left mr-8">NonBillable:</span>
      <span class="ml-auto">${data.nonBillable}</span>
    </div>
  </div>
  `;
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
  const billableData = data.map((d) => d.billable);
  const nonBillableData = data.map((d) => d.nonBillable);
  const maxY = d3.max([...billableData, ...nonBillableData]);
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
    .attr('rx', 4)
    .attr('fill', '#1976D2')
    .on('mouseover', (event, d) => {
      const tooltip = d3.select('#tooltip');
      tooltip
        .html(getTooltip(d))
        .style('visibility', 'visible')
        .style('background', 'white')
        .style('color', 'black')
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY}px`);
    })
    .on('mouseout', () => {
      const tooltip = d3.select('#tooltip');
      tooltip.style('visibility', 'hidden');
    });

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
    .attr('rx', 4)
    .attr('fill', '#CFD8DC')
    .on('mouseenter', (event, d) => {
      const tooltip = d3.select('#tooltip');
      tooltip
        .html(getTooltip(d))
        .style('visibility', 'visible')
        .style('background', 'white')
        .style('color', 'black')
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY}px`);
    })
    .on('mouseout', () => {
      const tooltip = d3.select('#tooltip');
      tooltip.style('visibility', 'hidden');
    });
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
    .attr('rx', 4)
    .attr('fill', '#EC407A')
    .on('mouseover', (event, d) => {
      const tooltip = d3.select('#tooltip');
      tooltip
        .html(getTooltip(d))
        .style('visibility', 'visible')
        .style('background', 'white')
        .style('color', 'black')
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY}px`);
    })
    .on('mouseout', () => {
      const tooltip = d3.select('#tooltip');
      tooltip.style('visibility', 'hidden');
    });

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
      <h2 class="my-4">D3.js - column and overlayed bar chart w/ tooltips</h2>
      <div ref="chart"></div>
      <div id="tooltip" style="position: absolute; visibility: hidden"></div>
    </div>
  </section>
</template>
