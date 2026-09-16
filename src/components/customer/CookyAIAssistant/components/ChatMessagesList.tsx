import React from "react";
import { Avatar, Typography, Card, Tag, Button, Flex, Spin } from "antd";
import { ThunderboltOutlined, PlusOutlined } from "@ant-design/icons";
import type { AIMessage } from "@src/types/ai";
import type { Product } from "@src/types/product";
import { DEFAULT_COOKIE_IMAGE } from "@src/constants";

const { Text, Paragraph } = Typography;

interface ChatMessagesListProps {
  messages: AIMessage[];
  loading: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  endRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onAddCookie: (productId: number) => void;
  cookies?: Product[];
}

export const ChatMessagesList: React.FC<ChatMessagesListProps> = ({
  messages,
  loading,
  containerRef,
  endRef,
  onScroll,
  onAddCookie,
  cookies = [],
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
            <div style={{ maxWidth: "86%" }}>
              <div
                style={{
                  padding: "12px 16px",
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
                  whiteSpace: "pre-line",
                }}
              >
                {msg.content}
              </div>

              {/* Grounded Cookie Options & Recommendations */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <Flex vertical gap={10} style={{ width: "100%" }}>
                    {msg.recommendations.map((rec, optIdx) => {
                      const matchedCookie = cookies.find((c) => c.id === rec.productId);
                      const displayImg = matchedCookie?.imageUrl || DEFAULT_COOKIE_IMAGE;
                      const displayPrice = rec.price || matchedCookie?.price;
                      const displayCategory = matchedCookie?.category;

                      return (
                        <Card
                          key={rec.productId}
                          size="small"
                          style={{
                            background: "#ffffff",
                            borderRadius: 10,
                            borderColor: "#d6e4ff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            overflow: "hidden",
                          }}
                        >
                          <Flex gap={10} align="flex-start">
                            {/* Product Thumbnail */}
                            <img
                              src={displayImg}
                              alt={rec.productName}
                              onError={(e) => {
                                e.currentTarget.src = DEFAULT_COOKIE_IMAGE;
                              }}
                              style={{
                                width: 52,
                                height: 52,
                                borderRadius: 8,
                                objectFit: "cover",
                                flexShrink: 0,
                                border: "1px solid #f0f0f0",
                              }}
                            />

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                <div>
                                  <Tag color="purple" style={{ fontSize: 10, lineHeight: "16px", margin: "0 4px 0 0" }}>
                                    Option {optIdx + 1}
                                  </Tag>
                                  {displayCategory && (
                                    <Tag color="blue" style={{ fontSize: 10, lineHeight: "16px", textTransform: "capitalize" }}>
                                      {displayCategory.replace("_", " ")}
                                    </Tag>
                                  )}
                                  <Text strong style={{ fontSize: 13, display: "block", marginTop: 2 }}>
                                    {rec.productName}
                                  </Text>
                                </div>

                                <Button
                                  type="primary"
                                  size="small"
                                  shape="round"
                                  icon={<PlusOutlined />}
                                  onClick={() => onAddCookie(rec.productId)}
                                  style={{
                                    backgroundColor: "#00009c",
                                    fontSize: 12,
                                    height: 26,
                                  }}
                                >
                                  Add to Box
                                </Button>
                              </Flex>

                              {displayPrice && (
                                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, color: "#fa8c16", display: "inline-block", marginTop: 2 }}>
                                  Rs. {displayPrice.toLocaleString()}
                                </Text>
                              )}

                              {rec.reason && (
                                <Paragraph
                                  type="secondary"
                                  style={{
                                    fontSize: 11,
                                    margin: "4px 0 0 0",
                                    lineHeight: 1.4,
                                    color: "#595959",
                                  }}
                                >
                                  {rec.reason}
                                </Paragraph>
                              )}
                            </div>
                          </Flex>
                        </Card>
                      );
                    })}
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
