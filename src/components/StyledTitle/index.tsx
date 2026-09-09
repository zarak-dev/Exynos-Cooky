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

  @media (max-width: 768px) {
    &.ant-typography.ant-typography-1 {
      font-size: 1.6rem;
    }
    &.ant-typography.ant-typography-2 {
      font-size: 1.35rem;
    }
    &.ant-typography.ant-typography-3 {
      font-size: 1.2rem;
    }
    &.ant-typography.ant-typography-4 {
      font-size: 1.1rem;
    }
    &.ant-typography.ant-typography-5 {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    &.ant-typography.ant-typography-1 {
      font-size: 1.35rem;
    }
    &.ant-typography.ant-typography-2 {
      font-size: 1.2rem;
    }
  }
`;

