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
    &.ant-typography {
      margin-bottom: 10px;
    }
  }

  &.ant-typography.ant-typography-1,
  h1&.ant-typography {
    @media (max-width: 768px) {
      font-size: 1.6rem !important;
    }
    @media (max-width: 480px) {
      font-size: 1.35rem !important;
    }
  }

  &.ant-typography.ant-typography-2,
  h2&.ant-typography {
    @media (max-width: 768px) {
      font-size: 1.35rem !important;
    }
    @media (max-width: 480px) {
      font-size: 1.2rem !important;
    }
  }

  &.ant-typography.ant-typography-3,
  h3&.ant-typography {
    @media (max-width: 768px) {
      font-size: 1.2rem !important;
    }
  }

  &.ant-typography.ant-typography-4,
  h4&.ant-typography {
    @media (max-width: 768px) {
      font-size: 1.05rem !important;
    }
  }

  &.ant-typography.ant-typography-5,
  h5&.ant-typography {
    @media (max-width: 768px) {
      font-size: 0.95rem !important;
    }
  }
`;

