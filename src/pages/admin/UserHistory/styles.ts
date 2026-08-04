import styled from "styled-components";
import { Card, Input } from "antd";

export const HistoryCardWrapper = styled(Card)`
  margin-top: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .ant-card-head-title {
    color: #00009c;
    font-weight: 700;
  }
`;
export const SearchInput= styled(Input.Search)`
max-width: 400px;
margin-bottom: 16px;
margin-left: 769px;
`;