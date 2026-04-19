import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function Chart({ data }) {
  return (
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="skill" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="level" />
    </BarChart>
  );
}

export default Chart;