import React, { useMemo } from "react";
import { Column } from "@ant-design/charts";
import { Empty } from "antd";
import type { Order } from "@src/types/order";
import { StyledChartCard, ChartWrapper } from "@src/pages/admin/Overview/styles";

interface FinancialPerformanceChartProps {
  netRevenue: number;
  orders?: Order[];
}

export const FinancialPerformanceChart: React.FC<FinancialPerformanceChartProps> = ({
  netRevenue,
  orders = [],
}) => {
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [];
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = new Map<string, number>();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    for (let i = 0; i <= currentMonth; i++) {
      monthlyMap.set(months[i], 0);
    }

    for (const order of orders) {
      if (order.status !== "Cancelled") {
        const dateStr = order.createdAt || order.timestamp;
        if (dateStr) {
          const orderDate = new Date(dateStr);
          if (!isNaN(orderDate.getTime()) && orderDate.getFullYear() === currentYear) {
            const m = months[orderDate.getMonth()];
            if (monthlyMap.has(m)) {
              monthlyMap.set(m, (monthlyMap.get(m) || 0) + (Number(order.totalPrice) || 0));
            }
          }
        }
      }
    }

    return Array.from(monthlyMap.entries()).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }, [orders]);

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
      <ChartWrapper height="350px" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {netRevenue > 0 && chartData.length > 0 ? (
          <Column {...columnConfig} />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No financial transactions recorded yet"
          />
        )}
      </ChartWrapper>
    </StyledChartCard>
  );
};
