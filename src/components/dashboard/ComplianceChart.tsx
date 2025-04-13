import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LabelList } from "recharts";
import { RequirementStatus } from "@/types";
import { useState, useEffect } from "react";

interface ComplianceChartProps {
  data: {
    fulfilled: number;
    partiallyFulfilled: number;
    notFulfilled: number;
    notApplicable: number;
  };
}

type ChartDataItem = {
  name: string;
  value: number;
  color: string;
};

export function ComplianceChart({ data }: ComplianceChartProps) {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    // Set animation to true after component mount
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const chartData: ChartDataItem[] = [
    {
      name: "Fulfilled",
      value: data.fulfilled,
      color: "#10B981", // modern green
    },
    {
      name: "Partially Fulfilled",
      value: data.partiallyFulfilled,
      color: "#F59E0B", // modern amber
    },
    {
      name: "Not Fulfilled",
      value: data.notFulfilled,
      color: "#EF4444", // modern red
    },
    {
      name: "Not Applicable",
      value: data.notApplicable,
      color: "#6B7280", // modern gray
    },
  ].filter((item) => item.value > 0);

  const total = Object.values(data).reduce((acc, curr) => acc + curr, 0);
  const complianceScore = Math.round((data.fulfilled + data.partiallyFulfilled * 0.5) / (total - data.notApplicable) * 100) || 0;

  // Calculate percentage for each status
  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  // Function to create shadow effect gradients for 3D appearance
  const createGradientId = (index: number) => `gradient-${index}`;
  
  return (
    <Card className="h-full overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg md:text-xl font-bold">Compliance Status</span>
          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
            {complianceScore}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {total > 0 ? (
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-2/3 relative">
              {/* Glow effect behind chart */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/10 rounded-full blur-xl" />
              
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  {/* Gradient definitions for 3D effect */}
                  <defs>
                    {chartData.map((entry, index) => (
                      <linearGradient 
                        key={`grad-${index}`}
                        id={createGradientId(index)} 
                        x1="0%" y1="0%" 
                        x2="100%" y2="100%"
                      >
                        <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  
                  {/* Shadow effect - slightly larger, positioned below */}
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="53%"
                    innerRadius={animated ? 60 : 50}
                    outerRadius={animated ? 105 : 75}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    startAngle={90}
                    endAngle={animated ? -270 : 90}
                    animationDuration={1500}
                    animationBegin={0}
                    strokeWidth={0}
                    stroke="none"
                    opacity={0.3}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`shadow-${index}`} 
                        fill="#000000"
                        opacity={0.1}
                      />
                    ))}
                  </Pie>
                  
                  {/* Main pie chart */}
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={animated ? 62 : 52}
                    outerRadius={animated ? 102 : 72}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    startAngle={90}
                    endAngle={animated ? -270 : 90}
                    animationDuration={1500}
                    animationBegin={0}
                    strokeWidth={2}
                    stroke="#ffffff"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#${createGradientId(index)})`}
                        opacity={animated ? 1 : 0.7}
                        // Add cursor style to indicate interactivity
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                    <LabelList 
                      dataKey="value" 
                      position="outside" 
                      style={{ fontSize: '11px', fill: '#64748b', fontWeight: 'bold' }} 
                      formatter={(value: number) => (getPercentage(value) >= 8 ? `${getPercentage(value)}%` : '')}
                    />
                  </Pie>
                  
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} requirement${value !== 1 ? "s" : ""} (${getPercentage(Number(value))}%)`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                      border: "none",
                      padding: "12px 16px",
                      fontWeight: 500,
                    }}
                    offset={20}
                    wrapperStyle={{ zIndex: 100, pointerEvents: "auto" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center score overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 dark:bg-slate-900/90 rounded-full h-32 w-32 flex items-center justify-center shadow-inner border-4 border-blue-100 dark:border-blue-900">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">{complianceScore}%</div>
                    <div className="text-xs text-muted-foreground font-medium">compliance score</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 space-y-3 p-2">
              {chartData.map((item) => (
                <div 
                  key={item.name} 
                  className="flex items-center p-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:translate-x-1 cursor-pointer"
                >
                  <div 
                    className="w-5 h-5 rounded-full mr-3 shadow-md" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">{item.value}</span>
                      <span className="text-xs text-muted-foreground">
                        ({getPercentage(item.value)}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
