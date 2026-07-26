import styled from "styled-components";
import { Button, Drawer, Flex, Typography } from "antd";

const { Text, Title } = Typography;

export const StyledDrawer = styled(Drawer)`
  font-family: "Poppins", sans-serif;
`;

export const DrawerHeaderTitle = styled(Title)`
  color: #00009c !important;
  font-weight: 800 !important;
  text-transform: uppercase;
  margin: 0 !important;
  font-family: "Poppins", sans-serif !important;
`;

export const SectionLabel = styled(Text)<{ $noMarginTop?: boolean }>`
  font-weight: 700;
  display: block;
  margin: ${(props) => (props.$noMarginTop ? "0 0 8px 0" : "20px 0 8px 0")};
  font-size: 0.8rem;
  color: #00009c;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: "Poppins", sans-serif;
`;

export const BoxTierWrapper = styled.div`
  margin-bottom: 16px;

  .ant-radio-group {
    width: 100%;
    display: flex;
    border: 2px solid #00009c;
  }

  .ant-radio-button-wrapper {
    flex: 1;
    text-align: center;
    border: none !important;
    border-radius: 0px !important;
    font-weight: 700;
    color: #00009c;
    height: 40px;
    line-height: 38px;
    font-family: "Poppins", sans-serif;
    text-transform: uppercase;
    font-size: 0.85rem;

    &::before {
      display: none !important;
    }
  }

  .ant-radio-button-wrapper-checked {
    background-color: #00009c !important;
    color: #ffffff !important;
  }
`;

export const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background: #fafafa;
  padding: 16px;
  border: 1px solid #e8e8e8;
`;

export const CookieSlot = styled(Flex)<{ $filled: boolean }>`
  aspect-ratio: 1;
  border: ${(props) =>
    props.$filled ? "2px solid #00009c" : "2px dashed #ccc"};
  background: ${(props) => (props.$filled ? "#ffffff" : "transparent")};
  overflow: hidden;
  position: relative;
  .ant-image,
  .ant-image-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const EmptySlotText = styled(Text)`
  color: #ccc;
  font-size: 1.2rem;
  font-weight: 300;
`;

export const ItemNameText = styled(Text)`
  font-weight: 700;
  color: #00009c;
  font-size: 0.9rem;
`;

export const DrawerFooter = styled(Flex)`
  margin-top: 40px;
  border-top: 2px solid #f0f0f0;
  padding-top: 20px;
`;

export const TotalRow = styled(Flex)`
  font-size: 1.1rem;
`;

export const TotalText = styled(Text)`
  font-weight: 800;
  color: #00009c;
`;

export const ActionButton = styled(Button)`
  width: 100%;
  height: 50px;
  background-color: #00009c;
  border-color: #00009c;
  color: #ffffff;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 0px;
  letter-spacing: 0.5px;
  margin-top: 20px;
  font-family: "Poppins", sans-serif;

  &:hover,
  &:focus {
    background-color: #000066 !important;
    border-color: #000066 !important;
    color: #ffffff !important;
  }
`;
