import styled from "styled-components";
import { Typography, Card } from "antd";

const { Title, Text } = Typography;

export const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PageTitle = styled(Title)`
  &.ant-typography {
    color: #00009c;
    margin: 0;
    font-weight: 800;
    font-size: 1.8rem;

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }
`;

export const OrdersCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    .ant-card-body {
      padding: 12px;
    }
  }
`;

export const OrderIdText = styled(Text)`
  font-weight: 700;
  color: #333;
`;

export const CustomerNameText = styled(Text)`
  color: #00009c;
`;

export const PriceText = styled(Text)``;

export const CompleteText = styled(Text)`
  color: #8c8c8c;
  font-size: 0.85rem;
`;

export const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 180px; /* Locks the total width so the layout is rigidly fixed */
`;

export const StatusActionContainer = styled.div`
  width: 130px; /* Traps the dynamic button so it can never push the delete icon */
  display: flex;
  align-items: center;
`;
