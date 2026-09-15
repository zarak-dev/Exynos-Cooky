import React, { useMemo } from "react";
import { Progress, Tag, Typography } from "antd";
import type { Product } from "../../../../types/product";
import {
  StyledChartCard,
  StockListWrapper,
  StockItem,
  StockItemHeader,
  StockTagsWrapper,
  StockCountText,
} from "../styles";

const { Text } = Typography;

interface KitchenStockOverviewProps {
  inventory: Product[];
}

export const KitchenStockOverview: React.FC<KitchenStockOverviewProps> = ({
  inventory,
}) => {
  const kitchenStockItems = useMemo(() => {
    const list = inventory.slice(0, 5);
    return list.map((item) => ({
      name: item.name,
      stock: item.stock,
      maxCapacity: 50,
    }));
  }, [inventory]);

  return (
    <StyledChartCard title="Kitchen Stock Status Overview" variant="borderless">
      <StockListWrapper>
        {kitchenStockItems.map((item, index) => {
          const stockPercentage = Math.min(
            100,
            Math.round((item.stock / item.maxCapacity) * 100),
          );
          const isLowStock = item.stock <= 5;
          return (
            <StockItem
              key={item.name}
              $isLast={index === kitchenStockItems.length - 1}
            >
              <StockItemHeader justify="space-between" align="center">
                <Text strong>{item.name}</Text>
                <StockTagsWrapper>
                  <StockCountText type="secondary">
                    {item.stock} / {item.maxCapacity} units
                  </StockCountText>
                  <Tag color={isLowStock ? "red" : "green"}>
                    {isLowStock ? "LOW STOCK" : "IN STOCK"}
                  </Tag>
                </StockTagsWrapper>
              </StockItemHeader>
              <Progress
                percent={stockPercentage}
                strokeColor={isLowStock ? "#f5222d" : "#00009c"}
                status={isLowStock ? "exception" : "normal"}
              />
            </StockItem>
          );
        })}
      </StockListWrapper>
    </StyledChartCard>
  );
};
