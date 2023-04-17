<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';

const chart = ref(null);

// sample data for now
const data = [
  { label: 'Grand', value: 35, color: '#afe7a0' },
  { label: 'Era', value: 17, color: '#fff0ca' },
  { label: 'Uh Oh', value: 65, color: '#e79087' },
];

onMounted(() => {
  const width = 650;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 70, left: 40 };
  const borderRadius = 8;

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const svg = d3
    .select(chart.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)

  // Needs paths if we want the nice border radius, otherwise could use rect
  svg
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('d', (d) => {
      const path = d3.path();
      path.moveTo(x(d.label) + borderRadius, y(d.value));
      path.lineTo(x(d.label) + x.bandwidth() - borderRadius, y(d.value));
      path.arcTo(
        x(d.label) + x.bandwidth(),
        y(d.value),
        x(d.label) + x.bandwidth(),
        y(d.value) + borderRadius,
        borderRadius,
      );
      path.lineTo(x(d.label) + x.bandwidth(), y(0) - borderRadius);
      path.arcTo(
        x(d.label) + x.bandwidth(),
        y(0),
        x(d.label) + x.bandwidth() - borderRadius,
        y(0),
        borderRadius,
      );
      path.lineTo(x(d.label) + borderRadius, y(0));
      path.arcTo(
        x(d.label),
        y(0),
        x(d.label),
        y(0) - borderRadius,
        borderRadius,
      );
      path.lineTo(x(d.label), y(d.value) + borderRadius);
      path.arcTo(
        x(d.label),
        y(d.value),
        x(d.label) + borderRadius,
        y(d.value),
        borderRadius,
      );
      path.closePath();
      return path.toString();
    })
    .attr('fill', (d) => d.color);

  // Need a custom x axis label for value and label
  svg
    .selectAll('text.value')
    .data(data)
    .join('text')
    .attr('class', 'value')
    .attr('x', (d) => x(d.label) + x.bandwidth() / 2)
    .attr('y', height - margin.bottom + 30) 
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .text((d) => d.value);

  svg
    .selectAll('text.label')
    .data(data)
    .join('text')
    .attr('class', 'label')
    .attr('x', (d) => x(d.label) + x.bandwidth() / 2)
    .attr('y', height - margin.bottom + 55) 
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .text((d) => d.label);
});
</script>

<template>
  <section>
    <div class="flex-col text-center align-middle">
      <h2>D3.js - bar chart</h2>
      <div ref="chart"></div>
    </div>
  </section>
</template>
