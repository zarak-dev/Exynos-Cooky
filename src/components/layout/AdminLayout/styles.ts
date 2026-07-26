import styled from "styled-components";
import { Layout, Flex, Typography, Button } from "antd";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const AdminLayoutWrapper = styled(Layout)`
  height: 100vh;
  overflow: hidden;
`;

export const StyledSider = styled(Sider)`
  background: #00009c !important;
  height: 100vh;
  position: fixed !important;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;

  .ant-menu {
    background: #00009c;
    margin-top: 16px;
  }
`;

export const AdminLogo = styled(Flex)`
  height: 64px;
  background: #000066;
  color: #ffffff;
  font-weight: 900;
  font-size: 1.1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-bottom: 1px solid #00004d;
`;

export const MainContentWrapper = styled(Layout)<{ $collapsed: boolean }>`
  margin-left: ${(props) =>
    props.$collapsed ? "0" : "200px"}; /* Drops to 0 when collapsed */
  transition: all 0.2s ease-in-out;
  height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const StyledHeader = styled(Header)`
  background: #ffffff !important;
  padding: 0 24px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;

  @media (max-width: 768px) {
    padding: 0 16px !important;
  }
`;

export const HeaderLeft = styled(Flex)`
  align-items: center;
  overflow: hidden; /* Prevents long titles from blowing out the flexbox */
`;

export const HeaderTitle = styled(Text)`
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
  color: #00009c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const HeaderSubtitle = styled(Text)`
  font-size: 0.85rem;
  color: #8c8c8c;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  background: #f5f5f5;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 768px) {
    margin: 12px;
    padding: 12px;
  }
`;
export const MenuToggleButton = styled(Button)`
  font-size: 18px;
  width: 40px;
  height: 40px;
  color: #00009c;
  margin-right: 16px;
`;

export const AdminNameText = styled(Text)`
  color: #00009c;
`;
