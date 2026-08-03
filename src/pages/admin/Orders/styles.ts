import styled from "styled-components";
import { Typography, Card } from "antd";

const { Text } = Typography;

export const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const OrdersCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    .ant-card-body {
      padding: 12px;
    }
  }
`;

export const PriceText = styled(Text)``;

export const CompleteText = styled(Text)`
  color: #8c8c8c;
  font-size: 0.85rem;
`;

export const StatusActionContainer = styled.div`
  width: 130px;
  display: flex;
  align-items: center;
`;
