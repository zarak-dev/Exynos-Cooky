import { Card } from "antd";
import styled from "styled-components";

interface ReusableCardProps {
  $isAvailable?: boolean;
}

export const StyledCard = styled(Card)<ReusableCardProps>`
  overflow: hidden;
  box-shadow: none;
  transition: all 0.3s ease;
  opacity: ${({ $isAvailable = true }) => ($isAvailable ? 1 : 0.5)};
    @media (max-width: 768px) {
    .ant-card-body {
      padding: 12px;
    }
`;
