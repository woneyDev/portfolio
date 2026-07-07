import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// 원본의 HighCharts 꺾은선(누적수익률 추이) 그래프를 가벼운 무료 라이브러리(recharts)로 재현합니다.
export default function TrendLineChart({ data, height = 180 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#888' }} tickLine={false} axisLine={{ stroke: '#e5e5e5' }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 9, fill: '#888' }} tickLine={false} axisLine={false} width={30} />
          <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`${v}%`, '']} />
          <Line type="monotone" dataKey="value" stroke="#0046FF" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
