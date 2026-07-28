import { Typography } from "antd";
import styled from "styled-components";

const { Title } = Typography;

export const StyledTitle = styled(Title)`
  &.ant-typography {
    color: #00009c;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
`;
