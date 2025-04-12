
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
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
      color: "#16DB93", // green
    },
    {
      name: "Partially Fulfilled",
      value: data.partiallyFulfilled,
      color: "#FFBC42", // amber
    },
    {
      name: "Not Fulfilled",
      value: data.notFulfilled,
      color: "#D81159", // red
    },
    {
      name: "Not Applicable",
      value: data.notApplicable,
      color: "#8D99AE", // gray
    },
  ].filter((item) => item.value > 0);

  const total = Object.values(data).reduce((acc, curr) => acc + curr, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Compliance Status</CardTitle>
      </CardHeader>
      <CardContent>
        {total > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text
                      x={x}
                      y={y}
                      fill={chartData[index].color}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight="bold"
                    >
                      {`${chartData[index].name} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `${value} requirement${value !== 1 ? "s" : ""}`,
                  "",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
