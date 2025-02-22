import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

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
      label: "Stock Price",
      data: [100, 120, 150, 130, 170, 160, 190, 200, 210, 250, 270, 300],
      borderColor: "rgba(128, 0, 128, 1)", // Purple line
      backgroundColor: "rgba(128, 0, 128, 0.2)", // Light purple fill
      fill: true,
      tension: 0.4, // Smooth curve effect
      pointRadius: 0, // Hide points
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false }, // Hide legend
    tooltip: { enabled: true },
  },
  scales: {
    x: { display: false }, // Hide X-axis
    y: { display: false }, // Hide Y-axis
  },
};

export default function StockAreaChart() {
  return <Line data={data} options={options} />;
}
