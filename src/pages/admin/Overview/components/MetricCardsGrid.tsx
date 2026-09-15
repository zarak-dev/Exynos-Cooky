import React from "react";
import { Row, Col, Statistic } from "antd";
import {
  ArrowUpOutlined,
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MetricCard, MetricIcon } from "../styles";

interface MetricCardsGridProps {
  netRevenue: number;
  boxesSold: number;
  growth: number;
  activeUsers: number;
}

export const MetricCardsGrid: React.FC<MetricCardsGridProps> = ({
  netRevenue,
  boxesSold,
  growth,
  activeUsers,
}) => {
  const stats = [
    {
      title: "Net Revenue",
      value: netRevenue,
      prefix: "Rs.",
      icon: <DollarOutlined />,
    },
    {
      title: "Boxes Baked / Sold",
      value: boxesSold,
      icon: <ShoppingOutlined />,
    },
    {
      title: "Month-over-Month Growth",
      value: growth,
      precision: 2,
      suffix: "%",
      icon: <ArrowUpOutlined />,
    },
    {
      title: "Active System Users",
      value: activeUsers,
      icon: <UserOutlined />,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {stats.map((stat, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <MetricCard variant="borderless">
            <MetricIcon>{stat.icon}</MetricIcon>
            <Statistic
              title={stat.title}
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              precision={stat.precision}
            />
          </MetricCard>
        </Col>
      ))}
    </Row>
  );
};
