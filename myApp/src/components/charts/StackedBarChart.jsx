import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const data = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Investment",
      data: [30, 50, 40, 20, 35, 60, 50, 20, 45, 55, 65, 50],
      backgroundColor: "rgba(0, 123, 255, 0.7)", // Blue
    },
    {
      label: "Loss",
      data: [20, 30, 15, 10, 20, 40, 30, 10, 25, 35, 40, 30],
      backgroundColor: "rgba(255, 0, 0, 0.7)", // Red
    },
    {
      label: "Profit",
      data: [10, 20, 25, 30, 15, 35, 40, 15, 20, 30, 50, 45],
      backgroundColor: "rgba(128, 0, 128, 0.7)", // Purple
    },
    {
      label: "Maintenance",
      data: [5, 10, 10, 15, 5, 20, 15, 5, 10, 15, 20, 10],
      backgroundColor: "rgba(169, 169, 169, 0.7)", // Gray
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    tooltip: { enabled: true },
  },
  scales: {
    x: { stacked: true },
    y: { stacked: true },
  },
};

export default function StackedBarChart() {
  return <Bar data={data} options={options} />;
}
