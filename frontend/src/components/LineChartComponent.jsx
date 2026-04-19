import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LineChartComponent({ data }) {
  // Mocking trend data. In reality, you'd fetch this.
  const chartData = [
    { day: "Mon", consistency: 60 },
    { day: "Tue", consistency: 65 },
    { day: "Wed", consistency: 80 },
    { day: "Thu", consistency: 75 },
    { day: "Fri", consistency: 90 },
    { day: "Sat", consistency: 85 },
    { day: "Sun", consistency: data?.consistency || 95 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
          />
          <Line 
            type="monotone" 
            dataKey="consistency" 
            stroke="#4F46E5" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
            activeDot={{ r: 8, stroke: '#4F46E5', strokeWidth: 0, fill: '#4F46E5' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
