"use client";

import {
  Chart as ChartJS,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { FC, memo } from "react";
import { Booking } from "@/models/booking";
import { Bar } from "react-chartjs-2";

ChartJS.register(Tooltip, CategoryScale, LinearScale, BarElement);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

const Chart: FC<{ userBookings: Booking[] }> = ({ userBookings }) => {
  const labels = userBookings.map((booking) => booking.hotelRoom.name);
  const amountSpent = userBookings.map((booking) => booking.totalPrice);

  return (
    <Bar
      options={options}
      data={{
        labels,
        datasets: [
          {
            label: "Amount Spent",
            data: amountSpent,
            borderWidth: 1,
            backgroundColor: "#F27405",
            hoverBackgroundColor: "#F2C641",
          },
        ],
      }}
    />
  );
};

export default memo(Chart);
