"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface RatingChartProps {
  data: { matchIndex: number; rating: number }[];
  height?: number;
}

export default function RatingChart({ data, height = 200 }: RatingChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(232, 131, 58, 0.3)");
    gradient.addColorStop(1, "rgba(232, 131, 58, 0)");

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((_, i) => `#${i + 1}`),
        datasets: [
          {
            label: "Rating",
            data: data.map((d) => d.rating),
            borderColor: "#E8833A",
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#E8833A",
            pointBorderColor: "#0A0A0A",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#111111",
            borderColor: "#1F1F1F",
            borderWidth: 1,
            titleColor: "#F5F5F0",
            bodyColor: "#E8833A",
            titleFont: { family: "Inter" },
            bodyFont: { family: "Inter", weight: "bold" },
            padding: 12,
            displayColors: false,
            callbacks: {
              title: (items) => `Partida ${items[0].label}`,
              label: (item) => `Rating: ${item.raw}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(31, 31, 31, 0.5)",
            },
            ticks: {
              color: "#555555",
              font: { size: 11 },
            },
          },
          y: {
            grid: {
              color: "rgba(31, 31, 31, 0.5)",
            },
            ticks: {
              color: "#555555",
              font: { size: 11 },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg"
        style={{
          height,
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
      >
        <p className="text-sm">Nenhuma partida registrada ainda</p>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
