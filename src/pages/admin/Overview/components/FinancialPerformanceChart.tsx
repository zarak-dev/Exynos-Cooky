import React, { useMemo } from "react";
import { Column } from "@ant-design/charts";
import { StyledChartCard, ChartWrapper } from "../styles";

interface FinancialPerformanceChartProps {
  netRevenue: number;
}

export const FinancialPerformanceChart: React.FC<FinancialPerformanceChartProps> = ({
  netRevenue,
}) => {
  const chartData = useMemo(() => {
    return [
      { month: "Jan", revenue: 45000 },
      { month: "Feb", revenue: 52000 },
      { month: "Mar", revenue: 61000 },
      { month: "Apr", revenue: 58000 },
      { month: "May", revenue: 74000 },
      { month: "Jun", revenue: netRevenue > 95000 ? netRevenue : 95000 },
    ];
  }, [netRevenue]);

  const columnConfig = {
    data: chartData,
    xField: "month",
    yField: "revenue",
    color: "#00009c",
    style: {
      radiusTopLeft: 6,
      radiusTopRight: 6,
    },
    label: {
      text: "revenue",
      position: "top",
      style: {
        fill: "#8c8c8c",
        opacity: 0.8,
        fontWeight: 600,
      },
    },
  };

  return (
    <StyledChartCard
      title="Gross Financial Performance Trajectory"
      variant="borderless"
    >
      <ChartWrapper height="350px">
        <Column {...columnConfig} />
      </ChartWrapper>
    </StyledChartCard>
  );
};
