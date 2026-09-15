import React from "react";
import { Input, Button, Space, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ChatInputBarProps {
  inputText: string;
  setInputText: (text: string) => void;
  loading: boolean;
  onSend: (text?: string) => void;
  suggestedQuestions: string[];
  messagesCount: number;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  inputText,
  setInputText,
  loading,
  onSend,
  suggestedQuestions,
  messagesCount,
}) => {
  return (
    <>
      {/* Quick Suggestion Chips (Shown on initial conversation) */}
      {messagesCount <= 2 && (
        <div style={{ marginBottom: 12 }}>
          <Text
            type="secondary"
            style={{ fontSize: 11, display: "block", marginBottom: 6 }}
          >
            Quick questions:
          </Text>
          <Space wrap size={[6, 6]}>
            {suggestedQuestions.map((q, idx) => (
              <Button
                key={idx}
                size="small"
                shape="round"
                disabled={loading}
                onClick={() => onSend(q)}
                style={{
                  fontSize: 12,
                  borderColor: "#d6e4ff",
                  color: "#00009c",
                }}
              >
                {q}
              </Button>
            ))}
          </Space>
        </div>
      )}

      {/* Input Field & Send Action */}
      <Space.Compact style={{ width: "100%" }}>
        <Input
          placeholder="Ask Cooky about flavors, cravings, box sets..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onPressEnter={() => onSend()}
          disabled={loading}
          size="large"
          style={{ borderRadius: "8px 0 0 8px" }}
        />
        <Button
          type="primary"
          size="large"
          icon={<SendOutlined />}
          loading={loading}
          disabled={loading || !inputText.trim()}
          onClick={() => onSend()}
          style={{
            borderRadius: "0 8px 8px 0",
            background: "#00009c",
            borderColor: "#00009c",
          }}
        />
      </Space.Compact>
    </>
  );
};
