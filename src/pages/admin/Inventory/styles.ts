import styled from 'styled-components';
import { Typography, Card, Tag, Image } from 'antd';

const { Title, Text } = Typography;

export const InventoryContainer = styled.div`
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
  }
`;

export const InventoryCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

export const CookieImage = styled(Image)`
  .ant-image-img {
    border-radius: 6px;
    object-fit: cover;
  }
`;

export const CookieNameText = styled(Text)`
  color: #00009c;
`;

export const PriceText = styled(Text)``;

export const StatusTag = styled(Tag)`
  font-weight: 600;
`;