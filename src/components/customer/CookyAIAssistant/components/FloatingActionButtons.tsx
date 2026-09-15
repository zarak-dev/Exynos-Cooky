import React from "react";
import { Button, Tooltip, Badge } from "antd";
import { ThunderboltOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { whatsappService } from "../../../../services/whatsapp/whatsappService";

import styled from "styled-components";

interface FloatingActionButtonsProps {
  onOpenAssistant: () => void;
}

const FloatingContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  transform: translateZ(0);
  will-change: transform;

  @media (max-width: 576px) {
    bottom: 16px;
    right: 14px;
    gap: 10px;

    .ant-btn-circle {
      width: 48px !important;
      height: 48px !important;
    }
  }
`;

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onOpenAssistant,
}) => {
  return (
    <FloatingContainer>
      {/* WhatsApp Support Button */}
      <Tooltip title="Chat with us on WhatsApp" placement="left">
        <Button
          type="primary"
          shape="circle"
          size="large"
          aria-label="Chat on WhatsApp"
          icon={<WhatsAppOutlined style={{ fontSize: 28, color: "#ffffff" }} />}
          onClick={() => whatsappService.openSupportChat()}
          style={{
            width: 56,
            height: 56,
            boxShadow: "0 6px 20px rgba(37, 211, 102, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            border: "none",
            cursor: "pointer",
            transition:
              "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 8px 24px rgba(37, 211, 102, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(37, 211, 102, 0.45)";
          }}
        />
      </Tooltip>

      {/* Cooky AI Assistant Button */}
      <Tooltip title="Ask Cooky AI" placement="left">
        <Badge count="AI" color="#fa8c16">
          <Button
            type="primary"
            shape="circle"
            size="large"
            aria-label="Open Cooky AI assistant"
            icon={<ThunderboltOutlined style={{ fontSize: 22 }} />}
            style={{
              width: 56,
              height: 56,
              boxShadow: "0 6px 20px rgba(0, 0, 156, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #00009c 0%, #391085 100%)",
              border: "none",
              cursor: "pointer",
              transition:
                "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(0, 0, 156, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(0, 0, 156, 0.35)";
            }}
            onClick={onOpenAssistant}
          />
        </Badge>
      </Tooltip>
    </FloatingContainer>
  );
};
