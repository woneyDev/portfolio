import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0046FF', '#10226A', '#5B8DEF', '#8FB4F5', '#B9CFF7', '#003CDE', '#7C9FE8'];

// 원본의 HighCharts 도넛(원형) 그래프를 가벼운 무료 라이브러리(recharts)로 재현합니다.
export default function AssetDonutChart({ data, height = 220 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={1}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`${v}%`, '']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
