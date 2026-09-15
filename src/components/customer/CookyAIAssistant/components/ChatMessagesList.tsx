import React from "react";
import { Avatar, Typography, Card, Tag, Button, Flex, Spin } from "antd";
import { ThunderboltOutlined, PlusOutlined } from "@ant-design/icons";
import type { AIMessage } from "../../../../types/ai";

const { Text, Paragraph } = Typography;

interface ChatMessagesListProps {
  messages: AIMessage[];
  loading: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  endRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onAddCookie: (productId: number) => void;
}

export const ChatMessagesList: React.FC<ChatMessagesListProps> = ({
  messages,
  loading,
  containerRef,
  endRef,
  onScroll,
  onAddCookie,
}) => {
  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{
        flex: 1,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        marginBottom: 16,
      }}
    >
      {messages.map((msg) => {
        const isUser = msg.sender === "user";
        return (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: 14,
            }}
          >
            {!isUser && (
              <Avatar
                size={32}
                icon={<ThunderboltOutlined />}
                style={{
                  background: "#00009c",
                  color: "#ffd666",
                  marginRight: 8,
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ maxWidth: "82%" }}>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: isUser
                    ? "16px 16px 2px 16px"
                    : "16px 16px 16px 2px",
                  background: isUser ? "#00009c" : "#ffffff",
                  color: isUser ? "#ffffff" : "#1f1f1f",
                  boxShadow: isUser
                    ? "0 2px 8px rgba(0,0,156,0.2)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {msg.content}
              </div>

              {/* Grounded Cookie Recommendations */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <Flex vertical gap={8} style={{ width: "100%" }}>
                    {msg.recommendations.map((rec) => (
                      <Card
                        key={rec.productId}
                        size="small"
                        style={{
                          background: "#ffffff",
                          borderRadius: 8,
                          borderColor: "#d6e4ff",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                        }}
                      >
                        <Flex justify="space-between" align="center">
                          <div>
                            <Text strong style={{ fontSize: 13, display: "block" }}>
                              {rec.productName}
                            </Text>
                            {rec.price && (
                              <Tag color="blue" style={{ marginTop: 2 }}>
                                Rs. {rec.price}
                              </Tag>
                            )}
                          </div>
                          <Button
                            type="primary"
                            size="small"
                            shape="round"
                            icon={<PlusOutlined />}
                            onClick={() => onAddCookie(rec.productId)}
                          >
                            Add to Box
                          </Button>
                        </Flex>
                        {rec.reason && (
                          <Paragraph
                            type="secondary"
                            style={{
                              fontSize: 11,
                              margin: "6px 0 0 0",
                            }}
                          >
                            {rec.reason}
                          </Paragraph>
                        )}
                      </Card>
                    ))}
                  </Flex>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
          <Avatar
            size={28}
            icon={<ThunderboltOutlined />}
            style={{ background: "#00009c", color: "#ffd666" }}
          />
          <Spin size="small" />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Cooky is checking today's oven batches...
          </Text>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
};
