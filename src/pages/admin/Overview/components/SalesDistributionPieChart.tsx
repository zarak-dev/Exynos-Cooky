import React, { useMemo } from "react";
import { Pie } from "@ant-design/charts";
import { StyledChartCard, ChartWrapper } from "../styles";

interface SalesDistributionPieChartProps {
  topSellers: Array<{ name: string; count: number }>;
}

export const SalesDistributionPieChart: React.FC<SalesDistributionPieChartProps> = ({
  topSellers,
}) => {
  const pieData = useMemo(() => {
    if (topSellers.length > 0) {
      return topSellers.slice(0, 5).map((s) => ({
        type: s.name,
        value: s.count,
      }));
    }
    return [
      { type: "Chilled Sugar", value: 40 },
      { type: "Chocolate Chip", value: 25 },
      { type: "Pink Velvet", value: 15 },
      { type: "Lotus Biscoff Lava", value: 12 },
      { type: "Chocolate Fudge", value: 8 },
    ];
  }, [topSellers]);

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "type",
    innerRadius: 0.6,
    label: { text: "value", style: { fontWeight: "bold" } },
    legend: {
      color: { position: "bottom", layout: { justifyContent: "center" } },
    },
  };

  return (
    <StyledChartCard title="Sales Distribution Share" variant="borderless">
      <ChartWrapper>
        <Pie {...pieConfig} />
      </ChartWrapper>
    </StyledChartCard>
  );
};
