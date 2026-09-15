import React from "react";
import { Button, Flex, Typography } from "antd";
import type { Cookie } from "../../../../types/product";
import {
  StyledDetailModal,
  ModalBodyWrapper,
  ModalLeft,
  ModalImageContainer,
  ModalRight,
  ModalCookieName,
  StatusBadge,
  StockBadge,
  FreshnessNotice,
  ModalActions,
} from "../styles";
import { StyledButton } from "../../../../components/StyledButton";

const { Text, Paragraph } = Typography;

interface CookieDetailModalProps {
  cookie: Cookie | null;
  onClose: () => void;
  onAddToCart: (cookie: Cookie) => void;
}

export const CookieDetailModal: React.FC<CookieDetailModalProps> = ({
  cookie,
  onClose,
  onAddToCart,
}) => {
  return (
    <StyledDetailModal
      centered
      open={!!cookie}
      onCancel={onClose}
      footer={null}
      width={680}
      destroyOnHidden
    >
      {cookie && (
        <ModalBodyWrapper>
          <ModalLeft>
            <ModalImageContainer>
              <img
                src={cookie.imageUrl}
                alt={cookie.name}
                loading="lazy"
                decoding="async"
              />
            </ModalImageContainer>
          </ModalLeft>
          <ModalRight>
            <Flex vertical gap={12}>
              <ModalCookieName level={2}>
                {cookie.name}
              </ModalCookieName>

              <Flex align="center" gap={10} wrap="wrap">
                <Text strong style={{ fontSize: "1.35rem", color: "#00009c" }}>
                  Rs. {cookie.price.toLocaleString()}
                </Text>
                <StatusBadge $isAvailable={cookie.isAvailable}>
                  <span className="dot" />
                  {cookie.isAvailable ? "Available" : "Sold Out"}
                </StatusBadge>
                {cookie.stock > 0 && (
                  <StockBadge>
                    {cookie.stock} in stock
                  </StockBadge>
                )}
              </Flex>

              <Paragraph
                type="secondary"
                style={{
                  marginTop: 4,
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  color: "#475569",
                }}
              >
                {cookie.description}
              </Paragraph>

              <FreshnessNotice>
                🍪 Freshly baked to order with 100% premium Belgian butter & chocolate
              </FreshnessNotice>
            </Flex>

            <ModalActions vertical gap={10}>
              <StyledButton
                type="primary"
                shape="round"
                block
                size="large"
                disabled={!cookie.isAvailable}
                onClick={() => {
                  onAddToCart(cookie);
                  onClose();
                }}
              >
                {cookie.isAvailable
                  ? "Add to Your Box 🍪"
                  : "Currently Sold Out"}
              </StyledButton>
              <Button
                shape="round"
                block
                size="large"
                onClick={onClose}
              >
                Back to Menu
              </Button>
            </ModalActions>
          </ModalRight>
        </ModalBodyWrapper>
      )}
    </StyledDetailModal>
  );
};
