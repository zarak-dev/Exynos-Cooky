import styled from "styled-components";
import { Flex, Image } from "antd";
import { StyledCard } from "../../../components/StyledCard";

export const PageLayout = styled(Flex)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 32px;
  align-items: flex-start;
`;

export const MainContent = styled(Flex)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  flex-direction: column;
  gap: 24px;
`;

export const LoadMoreWrapper = styled(Flex)`
  justify-content: center;
  padding-top: 16px;
`;
export const EqualCard = styled(StyledCard)`
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

export const CardFooter = styled(Flex)`
  margin-top: auto;
  flex-direction: column;
  gap: 8px;
`;

export const ModalImage = styled(Image)`
  width: 100% !important;
  height: 220px !important;
  object-fit: cover !important;
  border-radius: 12px !important;
`;
