import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-indigo-300 mb-1">{label}</p>
        <p>Consistency: <b>{payload[0].value}%</b></p>
      </div>
    );
  }
  return null;
};

export default function LineChartComponent({ data, realData }) {
  // Use real data if provided, else fall back to mock
  const chartData = realData && realData.length > 0 ? realData : [
    { day: "Mon", consistency: 60 },
    { day: "Tue", consistency: 65 },
    { day: "Wed", consistency: 80 },
    { day: "Thu", consistency: 75 },
    { day: "Fri", consistency: 90 },
    { day: "Sat", consistency: 85 },
    { day: "Sun", consistency: data?.consistency || 95 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="consistGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="consistency"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#consistGrad)"
            dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#6366f1", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
