import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { RequirementStatus } from "@/types";

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
  const chartData: ChartDataItem[] = [
    {
      name: "Fulfilled",
      value: data.fulfilled,
      color: "#10B981" // modern green
    },
    {
      name: "Partially Fulfilled",
      value: data.partiallyFulfilled,
      color: "#F59E0B" // modern amber
    },
    {
      name: "Not Fulfilled",
      value: data.notFulfilled,
      color: "#EF4444" // modern red
    },
    {
      name: "Not Applicable",
      value: data.notApplicable,
      color: "#6B7280" // modern gray
    },
  ].filter((item) => item.value > 0);

  const total = Object.values(data).reduce((acc, curr) => acc + curr, 0);
  const complianceScore = Math.round((data.fulfilled + data.partiallyFulfilled * 0.5) / (total - data.notApplicable) * 100) || 0;

  // Calculate percentage for each status
  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-1">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg font-semibold">Compliance Status</span>
          <span className="text-3xl font-bold text-blue-600">
            {complianceScore}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {total > 0 ? (
          <div className="flex flex-col items-center">
            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={64}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} req${value !== 1 ? "s" : ""} (${getPercentage(Number(value))}%)`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "6px",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      border: "none",
                      padding: "6px 10px",
                      fontSize: "12px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full grid grid-cols-2 gap-1.5 mt-3">
              {chartData.map((item) => (
                <div 
                  key={item.name} 
                  className="flex items-center p-1.5 rounded-md bg-gray-50 dark:bg-gray-800/50"
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-1.5 flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{item.name}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      {item.value} ({getPercentage(item.value)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-[240px] items-center justify-center">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
