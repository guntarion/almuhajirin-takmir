export interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface BarChartProps {
  data: ChartData;
  height?: number;
}

export interface PieChartProps {
  data: ChartData;
  height?: number;
}

export interface LineChartProps {
  data: ChartData;
  height?: number;
}
