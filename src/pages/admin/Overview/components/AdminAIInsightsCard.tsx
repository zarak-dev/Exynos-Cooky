import React from "react";
import { Button, Card, Flex, Typography, Tag, Spin, Alert } from "antd";
import {
  BulbOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import { fetchAdminInsightsRequest } from "../../../../store/slices/aiSlice";
import type { AdminAIInsight } from "../../../../types/ai";

const { Title, Text, Paragraph } = Typography;

interface AdminAIInsightsCardProps {
  totalRevenue: number;
  totalOrders: number;
  topSellers: Array<{ name: string; count: number }>;
  lowStockItems: Array<{ name: string; stock: number }>;
}

export const AdminAIInsightsCard: React.FC<AdminAIInsightsCardProps> = ({
  totalRevenue,
  totalOrders,
  topSellers,
  lowStockItems,
}) => {
  const dispatch = useDispatch();
  const { adminInsights, insightsLoading, error } = useSelector(
    (state: RootState) => state.ai,
  );

  const handleGenerateInsights = () => {
    dispatch(
      fetchAdminInsightsRequest({
        netRevenue: totalRevenue,
        totalOrders,
        topSellers,
        lowStockItems,
      }),
    );
  };

  const getTag = (type: AdminAIInsight["type"]) => {
    switch (type) {
      case "positive":
        return <Tag color="success" icon={<CheckCircleOutlined />}>OPPORTUNITY</Tag>;
      case "warning":
        return <Tag color="error" icon={<WarningOutlined />}>ACTION REQUIRED</Tag>;
      default:
        return <Tag color="blue" icon={<RiseOutlined />}>GROWTH</Tag>;
    }
  };

  return (
    <Card
      variant="borderless"
      style={{
        marginBottom: 24,
        background: "linear-gradient(135deg, #0b1536 0%, #15275e 100%)",
        color: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(11, 21, 54, 0.12)",
      }}
    >
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Flex align="center" gap={12}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: "#ffd666",
            }}
          >
            <BulbOutlined />
          </div>
          <div>
            <Title level={4} style={{ color: "#ffffff", margin: 0 }}>
              AI Executive Kitchen Insights
            </Title>
            <Text style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: 13 }}>
              Powered by Grok Intelligence grounded in live bakery orders & inventory
            </Text>
          </div>
        </Flex>

        <Button
          type="primary"
          shape="round"
          icon={<ThunderboltOutlined />}
          style={{
            backgroundColor: "#fa8c16",
            borderColor: "#fa8c16",
            fontWeight: 600,
          }}
          loading={insightsLoading}
          onClick={handleGenerateInsights}
        >
          {adminInsights.length > 0 ? "Re-Analyze Operations" : "Generate AI Insights"}
        </Button>
      </Flex>

      {error && (
        <Alert
          type="warning"
          message={error}
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      {insightsLoading && (
        <Flex justify="center" align="center" style={{ padding: 32 }}>
          <Spin size="large" />
          <Text style={{ color: "#ffffff", marginLeft: 16 }}>
            Analyzing order velocity, flavor margins, and oven bottlenecks...
          </Text>
        </Flex>
      )}

      {adminInsights.length > 0 && !insightsLoading && (
        <div style={{ marginTop: 20 }}>
          <Flex vertical gap={12} style={{ width: "100%" }}>
            {adminInsights.map((insight, idx) => (
              <Card
                key={idx}
                size="small"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: 8,
                }}
              >
                <Flex justify="space-between" align="center" style={{ marginBottom: 6 }}>
                  <Text strong style={{ color: "#ffffff", fontSize: 15 }}>
                    {insight.title}
                  </Text>
                  {getTag(insight.type)}
                </Flex>
                <Paragraph style={{ color: "rgba(255, 255, 255, 0.85)", margin: 0, fontSize: 13 }}>
                  {insight.description}
                </Paragraph>
                {insight.actionableStep && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: "6px 10px",
                      background: "rgba(255, 255, 255, 0.06)",
                      borderRadius: 6,
                      fontSize: 12,
                      color: "#ffd666",
                    }}
                  >
                    <strong>Recommended Action:</strong> {insight.actionableStep}
                  </div>
                )}
              </Card>
            ))}
          </Flex>
        </div>
      )}
    </Card>
  );
};
