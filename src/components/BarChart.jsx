import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({ prodTime, breakTime, feedbackTime }) => {
  const convertToHours = (seconds) => (seconds / 3600).toFixed(2);
  const chartData = {
    labels: ["Production", "Break", "Feedback"],
    datasets: [
      {
        label: "Time", 
        data: [
          convertToHours(prodTime),
          convertToHours(breakTime),
          convertToHours(feedbackTime),
        ],
        backgroundColor: [
          "#ADD8E6", // Light Blue
          "#D7BDE2", // Lavender
          "#F5CBA7", // Light Orange
        ],
        borderColor: [
          "#27AE60", // Light Green
          "#2980B9", // Sky Blue
          "#D35400", // Peach
        ],
        border:1,
        borderRadius: 10,
      },
      
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#D3D3D3",
        },
      },
      title: {
        display: true,
        text: "Time Spent on Activities",
        color: "#000000",
      },
    },
    scales: {
      y: {
        color: "#000000",
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + " hrs"; // Append "hrs" to the y-axis ticks
          },
        },
        grid: {
          display: false, // Disable grid lines on the y-axis
        },
      },
      x: {
        color: "#000000",
        grid: {
          display: false, // Disable grid lines on the x-axis
        },
      },
    },
  };

  return (
    <div
      style={{ width: "30rem", height: "25rem" }}
      className="w-[30rem] h-[25rem] bg-formbackground rounded-lg shadow-xl p-6 border-b-slate-800 text-black"
    >
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};
