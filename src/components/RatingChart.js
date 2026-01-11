import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function RatingChart({ feedbacks }) {
  const counts = [1, 2, 3, 4, 5].map(
    (r) => feedbacks.filter((f) => f.rating === r).length
  );

  const data = {
    labels: ["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"],
    datasets: [
      {
        label: "Ratings",
        data: counts,
        backgroundColor: "#007bff",
      },
    ],
  };

  return (
    <div className="card">
      <h3>Rating Analysis</h3>
      <Bar data={data} />
    </div>
  );
}
