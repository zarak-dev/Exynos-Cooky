import React from "react";
import { Empty, Button, Flex } from "antd";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  description = "No items found",
  actionText,
  onAction,
}) => {
  return (
    <Flex vertical align="center" justify="center" style={{ padding: "48px 24px" }}>
      <Empty description={description} />
      {actionText && onAction && (
        <Button
          type="primary"
          shape="round"
          onClick={onAction}
          style={{ marginTop: 16 }}
        >
          {actionText}
        </Button>
      )}
    </Flex>
  );
};
