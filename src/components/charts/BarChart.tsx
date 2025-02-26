// File: src/components/charts/BarChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type DataItem = Record<string, string | number>;

interface BarChartProps {
  data: DataItem[];
  xKey: string;
  yKey: string;
  height?: number;
}

export function BarChart({ data, xKey, yKey, height = 300 }: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Setup dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => String(d[xKey])))
      .padding(0.2);

    const y = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain([0, d3.max(data, d => Number(d[yKey])) || 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add bars
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(String(d[xKey])) || 0)
      .attr('y', d => y(Number(d[yKey])))
      .attr('width', x.bandwidth())
      .attr('height', d => chartHeight - y(Number(d[yKey])))
      .attr('fill', '#3b82f6')
      .attr('rx', 4)
      .attr('ry', 4);

    // Add value labels
    svg.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => (x(String(d[xKey])) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(Number(d[yKey])) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d[yKey]);

  }, [data, xKey, yKey, height]);

  return <div ref={chartRef} className="w-full" />;
}
