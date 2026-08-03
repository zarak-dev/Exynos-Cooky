import styled from "styled-components";
import {Tag, Image } from "antd";

export const InventoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;


export const CookieImage = styled(Image)`
  .ant-image-img {
    border-radius: 6px;
    object-fit: cover;
  }
`;


export const StatusTag = styled(Tag)`
  font-weight: 600;
`;
