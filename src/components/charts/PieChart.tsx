// File: src/components/charts/PieChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
}

export function PieChart({ data, height = 300 }: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Setup dimensions
    const margin = { top: 20, right: 120, bottom: 20, left: 20 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const radius = Math.min(width, chartHeight) / 2;

    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2 + margin.left},${height / 2})`);

    // Generate color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Generate pie chart
    const pie = d3.pie<{ name: string; value: number }>()
      .value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Add arcs
    const arcs = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colorScale(i.toString()))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    // Add labels
    const arcLabel = d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);

    arcs.append('text')
      .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(d => d.data.value.toString());

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${radius + 20}, ${-radius})`);

    data.forEach((d, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendItem.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colorScale(i.toString()));

      legendItem.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(`${d.name} (${d.value})`);
    });

  }, [data, height]);

  return <div ref={chartRef} className="w-full h-full" />;
}
