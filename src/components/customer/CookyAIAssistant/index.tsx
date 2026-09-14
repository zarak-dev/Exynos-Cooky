import React, { useState, useRef, useEffect } from "react";
import {
  Drawer,
  Button,
  Input,
  Flex,
  Typography,
  Card,
  Avatar,
  Tag,
  Spin,
  Space,
  Badge,
  message,
} from "antd";
import {
  ThunderboltOutlined,
  SendOutlined,
  PlusOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";
import {
  askAIRequest,
  clearAIConversation,
  setAIAssistantOpen,
} from "../../../store/slices/aiSlice";
import { addCookieWithFeedback } from "../../../utils/cartActions";

const { Text, Paragraph } = Typography;

const SUGGESTED_QUESTIONS = [
  "What is your best chocolate cookie?",
  "Recommend something not too sweet",
  "Which cookies are best for kids?",
  "What's in the Lotus Biscoff Lava?",
];

export const CookyAIAssistant: React.FC = () => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const { isAIAssistantOpen, messages, loading } = useSelector(
    (state: RootState) => state.ai,
  );
  const cookies = useSelector((state: RootState) => state.inventory.items);
  const { items: cartItems, boxSize } = useSelector(
    (state: RootState) => state.cart,
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAIAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAIAssistantOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    dispatch(askAIRequest({ prompt: text.trim() }));
    setInputText("");
  };

  const handleAddCookie = (productId: number) => {
    const targetCookie = cookies.find((c) => c.id === productId);
    if (!targetCookie) {
      messageApi.error("Cookie not found in current kitchen inventory");
      return;
    }
    addCookieWithFeedback(
      targetCookie,
      cartItems.length,
      boxSize,
      dispatch,
      messageApi,
    );
  };

  return (
    <>
      {contextHolder}

      {/* Floating Action Button */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 999,
        }}
      >
        <Badge count="AI" color="#fa8c16">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<ThunderboltOutlined style={{ fontSize: 22 }} />}
            style={{
              width: 58,
              height: 58,
              boxShadow: "0 6px 20px rgba(0, 0, 156, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #00009c 0%, #391085 100%)",
              border: "none",
            }}
            onClick={() => dispatch(setAIAssistantOpen(true))}
            title="Ask Cooky AI"
          />
        </Badge>
      </div>

      {/* AI Assistant Drawer */}
      <Drawer
        title={
          <Flex align="center" justify="space-between" style={{ width: "100%" }}>
            <Flex align="center" gap={10}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #00009c 0%, #722ed1 100%)",
                  color: "#ffd666",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                <ThunderboltOutlined />
              </div>
              <div>
                <Text strong style={{ fontSize: 16, display: "block" }}>
                  Cooky AI Assistant
                </Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Artisan Sommelier • Powered by Grok
                </Text>
              </div>
            </Flex>
            <Button
              type="text"
              size="small"
              icon={<ClearOutlined />}
              onClick={() => dispatch(clearAIConversation())}
              title="Clear conversation"
            >
              Clear
            </Button>
          </Flex>
        }
        placement="right"
        width={typeof window !== "undefined" && window.innerWidth < 480 ? "100%" : 420}
        onClose={() => dispatch(setAIAssistantOpen(false))}
        open={isAIAssistantOpen}
        styles={{
          body: {
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            backgroundColor: "#f9faff",
          },
        }}
      >
        {/* Messages List */}
        <div style={{ flex: 1, overflowY: "auto", marginBottom: 16 }}>
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

                  {/* Grounded Recommendations */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <Space direction="vertical" style={{ width: "100%" }} size={8}>
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
                                onClick={() => handleAddCookie(rec.productId)}
                              >
                                Add to Box
                              </Button>
                            </Flex>
                            <Paragraph
                              type="secondary"
                              style={{
                                fontSize: 11,
                                margin: "6px 0 0 0",
                              }}
                            >
                              {rec.reason}
                            </Paragraph>
                          </Card>
                        ))}
                      </Space>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <Flex align="center" gap={8} style={{ padding: 8 }}>
              <Spin size="small" />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Cooky AI is baking your answer...
              </Text>
            </Flex>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 6 }}>
            Suggested Questions:
          </Text>
          <Space wrap size={[4, 6]}>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <Tag
                key={idx}
                style={{
                  cursor: "pointer",
                  background: "#ffffff",
                  borderColor: "#d9d9d9",
                  borderRadius: 12,
                  fontSize: 11,
                  padding: "2px 8px",
                }}
                onClick={() => handleSendMessage(q)}
              >
                {q}
              </Tag>
            ))}
          </Space>
        </div>

        {/* Input Bar */}
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="Ask about flavors, ingredients, boxes..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPressEnter={() => handleSendMessage()}
            size="large"
            disabled={loading}
          />
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            loading={loading}
            onClick={() => handleSendMessage()}
          />
        </Space.Compact>
      </Drawer>
    </>
  );
};
