import React from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import dayjs from "dayjs";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const LineChart = ({ data }) => {
	// Format bulan menjadi nama bulan yang lebih deskriptif
	const formatMonth = (month) => {
		return dayjs(month).format("MMMM YYYY");
	};

	const chartData = {
		labels: data.map((item) => formatMonth(item.month)),
		datasets: [
			{
				label: "Pendapatan",
				data: data.map((item) => item.revenue),
				fill: false,
				borderColor: "rgb(75, 192, 192)",
				tension: 0.1,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false, // Menjadikan chart tidak mempertahankan rasio aspek
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Pendapatan Bulanan",
			},
		},
	};

	return <Line data={chartData} options={options} />;
};

export default LineChart;
