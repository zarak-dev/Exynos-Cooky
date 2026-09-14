import React from "react";
import { Result, Button } from "antd";

interface ErrorStateProps {
  title?: string;
  subTitle?: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  subTitle = "An error occurred while communicating with the kitchen server.",
  onRetry,
  retryText = "Try Again",
}) => {
  return (
    <Result
      status="warning"
      title={title}
      subTitle={subTitle}
      extra={
        onRetry && (
          <Button type="primary" shape="round" onClick={onRetry}>
            {retryText}
          </Button>
        )
      }
    />
  );
};
