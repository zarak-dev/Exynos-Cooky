import React from "react";
import { Spin } from "antd";
import { FullScreenOverlay, LoadingText } from "./styles";

interface PageLoaderProps {
  text?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  text = "Loading...",
}) => (
  <FullScreenOverlay>
    <Spin size="large" />
    <LoadingText>{text}</LoadingText>
  </FullScreenOverlay>
);

// Transparent wrapper for backward compatibility without simulated timers
export const PageTransitionLoader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

export default PageLoader;
