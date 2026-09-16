import React, { useMemo } from "react";
import { Pie } from "@ant-design/charts";
import { Empty } from "antd";
import { StyledChartCard, ChartWrapper } from "@src/pages/admin/Overview/styles";

interface SalesDistributionPieChartProps {
  topSellers: Array<{ name: string; count: number }>;
}

export const SalesDistributionPieChart: React.FC<SalesDistributionPieChartProps> = ({
  topSellers,
}) => {
  const pieData = useMemo(() => {
    return topSellers.slice(0, 5).map((s) => ({
      type: s.name,
      value: s.count,
    }));
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
      <ChartWrapper style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {topSellers.length > 0 ? (
          <Pie {...pieConfig} />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No cookie sales recorded yet"
          />
        )}
      </ChartWrapper>
    </StyledChartCard>
  );
};
