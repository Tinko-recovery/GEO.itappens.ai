'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Top 10 Keywords',
    'Traditional SEO': 4000,
    'AI Answer Engines': 2400,
  },
  {
    name: 'Branded Search',
    'Traditional SEO': 3000,
    'AI Answer Engines': 1398,
  },
  {
    name: 'Informational Queries',
    'Traditional SEO': 2000,
    'AI Answer Engines': 9800,
  },
  {
    name: 'Competitor Overlap',
    'Traditional SEO': 2780,
    'AI Answer Engines': 3908,
  },
];

export default function ComparisonChart() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800">SEO vs. GEO Visibility Overlay</h3>
        <span className="text-xs text-gray-500">Last 30 Days</span>
      </div>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#4B5563' }} />
            <Bar dataKey="Traditional SEO" fill="#D1D5DB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="AI Answer Engines" fill="#3abeF9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
