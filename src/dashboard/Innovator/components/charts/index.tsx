

import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#1a1f2e",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 12,
      borderColor: "#2a3142",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(255, 255, 255, 0.05)",
        drawBorder: false,
      },
      ticks: {
        color: "#9ca3af",
        font: {
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: "rgba(255, 255, 255, 0.05)",
        drawBorder: false,
      },
      ticks: {
        color: "#9ca3af",
        font: {
          size: 11,
        },
        padding: 8,
      },
      border: {
        display: false,
      },
    },
  },
}

export function BarChart({ data, index, categories, colors }) {
  const chartData = {
    labels: data.map((d) => d[index]),
    datasets: categories.map((category, i) => ({
      data: data.map((d) => d[category]),
      backgroundColor: colors,
      borderWidth: 0,
      borderRadius: 4,
      barThickness: 24,
    })),
  }

  return <Bar data={chartData} options={defaultOptions} />
}

export function LineChart({ data, index, categories, colors }) {
  const chartData = {
    labels: data.map((d) => d[index]),
    datasets: categories.map((category, i) => ({
      data: data.map((d) => d[category]),
      borderColor: colors[i],
      backgroundColor: colors[i],
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
    })),
  }

  const options = {
    ...defaultOptions,
    cutout: "60%",
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          color: "#9ca3af",
          font: {
            size: 11,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
  }
  

  return <Line data={chartData} options={options} />
}

export function PieChart({ data, index, categories, colors }) {
  const chartData = {
    labels: data.map((d) => d[index]),
    datasets: categories.map((category) => ({
      data: data.map((d) => d[category]),
      backgroundColor: colors,
      borderWidth: 0,
    })),
  }

  const options = {
    ...defaultOptions,
    cutout: "60%",
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          color: "#9ca3af",
          font: {
            size: 11,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
  }

  return <Pie data={chartData} options={options} />
}

