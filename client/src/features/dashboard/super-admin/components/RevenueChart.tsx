import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface RevenueData {
  name: string;
  إيرادات: number;
  حجوزات: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  formatCurrency: (amount: number) => string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, formatCurrency }) => {
  return (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>الإيرادات الشهرية والحجوزات</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 px-2 border-gray-700">
              <Download size={14} className="mr-1" />
              تصدير
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-700">
              <MoreHorizontal size={14} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 pt-4 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                yAxisId="left"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value/1000}ك`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", borderRadius: "8px" }}
                itemStyle={{ color: "#fff" }}
                formatter={(value: any, name: string) => {
                  if (name === "إيرادات") {
                    return [formatCurrency(value as number), name];
                  }
                  return [value, name];
                }}
                labelStyle={{ color: "#9CA3AF" }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingTop: "16px" }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="إيرادات" 
                stroke="#39FF14" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="حجوزات" 
                stroke="#0070F3" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;