import styled from "styled-components";
import { Layout, Card, Typography, Flex, Radio, Button, Divider } from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

export const CartContainer = styled(Content)`
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: transparent;
`;

export const EmptyCartContainer = styled(Flex)`
  padding: 60px 24px;
  background: #ffffff;
  border-radius: 8px;
`;

export const StyledCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const PageTitle = styled(Title)`
  color: #00009c !important;
  font-weight: 800 !important;
  margin-bottom: 24px !important;
`;

export const SummaryTitle = styled(Text)`
  color: #00009c;
  font-weight: 700;
`;

export const BoxTierLabel = styled(Text)`
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

export const TotalText = styled(Text)`
  font-size: 1.2rem;
  color: #00009c;
`;

export const SummaryRow = styled(Flex)`
  margin-bottom: 12px;
`;

export const TotalRow = styled(Flex)`
  margin-bottom: 24px;
`;

export const RadioGroupWrapper = styled(Flex)`
  margin-bottom: 20px;
`;

export const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
  display: flex;

  .ant-radio-button-wrapper {
    flex: 1;
    text-align: center;
    border-color: #00009c;
  }
`;

export const ActionButton = styled(Button)`
  background: #00009c;
  border-color: #00009c;
  font-weight: 700;
`;

export const QuantityControl = styled(Flex)`
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 4px;
  width: fit-content;
  margin: 0 auto;
`;

export const QuantityText = styled(Text)`
  display: inline-block;
  width: 36px;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  font-variant-numeric: tabular-nums;
`;
export const CookieNameText = styled(Text)`
  color: #00009c;
`;

export const BoxCapacityText = styled(Text)<{ $isFull: boolean }>`
  color: ${(props) => (props.$isFull ? "#52c41a" : "#fa8c16")};
`;

export const SpacedDivider = styled(Divider)`
  margin: 16px 0;
`;

export const ContinueButton = styled(Button)`
  margin-top: 16px;
  background: #00009c;
  border-color: #00009c;
  font-weight: 700;
`;
