// File: src/components/charts/LineChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type DataItem = Record<string, string | number>;

interface LineDefinition {
  key: string;
  title: string;
}

interface LineChartProps {
  data: DataItem[];
  xKey: string;
  yKey: string;
  title?: string;
  height?: number;
  multipleLines?: LineDefinition[];
}

export function LineChart({ 
  data, 
  xKey, 
  yKey, 
  title, 
  height = 300,
  multipleLines 
}: LineChartProps) {
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

    // Parse dates if xKey is date
    const xValues = data.map(d => d[xKey]);
    const isDateString = typeof xValues[0] === 'string' && !isNaN(Date.parse(xValues[0] as string));
    
    // Create scales
    type XScale = d3.ScaleTime<number, number> | d3.ScalePoint<string>;
    const x: XScale = isDateString
      ? d3.scaleTime()
          .range([0, width])
          .domain(d3.extent(data, d => new Date(d[xKey] as string)) as [Date, Date])
      : d3.scalePoint()
          .range([0, width])
          .domain(data.map(d => String(d[xKey])));

    const allValues = multipleLines 
      ? multipleLines.flatMap(line => data.map(d => Number(d[line.key])))
      : data.map(d => Number(d[yKey]));

    const y = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain([0, d3.max(allValues) || 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(isDateString 
        ? d3.axisBottom(x as d3.ScaleTime<number, number>) 
        : d3.axisBottom(x as d3.ScalePoint<string>))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Create line generator
    const line = d3.line<DataItem>()
      .x(d => {
        const xValue = isDateString ? new Date(d[xKey] as string) : String(d[xKey]);
        return isDateString 
          ? (x as d3.ScaleTime<number, number>)(xValue as Date)
          : (x as d3.ScalePoint<string>)(xValue as string) || 0;
      })
      .y(d => y(Number(d[yKey])));

    // Generate color scale for multiple lines
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    if (multipleLines) {
      // Draw multiple lines
      multipleLines.forEach((linedef, i) => {
        svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', colorScale(linedef.title))
          .attr('stroke-width', 2)
          .attr('d', d3.line<DataItem>()
            .x(d => {
              const xValue = isDateString ? new Date(d[xKey] as string) : String(d[xKey]);
              return isDateString 
                ? (x as d3.ScaleTime<number, number>)(xValue as Date)
                : (x as d3.ScalePoint<string>)(xValue as string) || 0;
            })
            .y(d => y(Number(d[linedef.key])))
          );

        // Add dots for each point
        svg.selectAll(`.dot-${i}`)
          .data(data)
          .enter()
          .append('circle')
          .attr('class', `dot-${i}`)
          .attr('cx', d => {
            const xValue = isDateString ? new Date(d[xKey] as string) : String(d[xKey]);
            return isDateString 
              ? (x as d3.ScaleTime<number, number>)(xValue as Date)
              : (x as d3.ScalePoint<string>)(xValue as string) || 0;
          })
          .attr('cy', d => y(Number(d[linedef.key])))
          .attr('r', 4)
          .attr('fill', colorScale(linedef.title));
      });

      // Add legend
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 100}, 0)`);

      multipleLines.forEach((linedef, i) => {
        const legendItem = legend.append('g')
          .attr('transform', `translate(0, ${i * 20})`);

        legendItem.append('rect')
          .attr('width', 15)
          .attr('height', 15)
          .attr('fill', colorScale(linedef.title));

        legendItem.append('text')
          .attr('x', 20)
          .attr('y', 12)
          .text(linedef.title);
      });
    } else {
      // Draw single line
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('d', line);

      // Add dots
      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => {
          const xValue = isDateString ? new Date(d[xKey] as string) : String(d[xKey]);
          return isDateString 
            ? (x as d3.ScaleTime<number, number>)(xValue as Date)
            : (x as d3.ScalePoint<string>)(xValue as string) || 0;
        })
        .attr('cy', d => y(Number(d[yKey])))
        .attr('r', 4)
        .attr('fill', '#3b82f6');
    }

    // Add title if provided
    if (title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .text(title);
    }

  }, [data, xKey, yKey, title, height, multipleLines]);

  return <div ref={chartRef} className="w-full h-full" />;
}
