import styled from 'styled-components';
import { Layout, Flex, Typography } from 'antd';

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
  z-index: 100;

  .ant-menu {
    background: #00009c;
    margin-top: 16px;
  }
`;

// 🌟 FIX: Styled Ant Design <Flex> instead of HTML <div>
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
  margin-left: ${(props) => (props.$collapsed ? '80px' : '200px')};
  transition: all 0.2s ease-in-out;
  height: 100vh;
`;

export const StyledHeader = styled(Header)`
  background: #ffffff !important;
  padding: 0 24px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
`;

// 🌟 NEW: Styled Ant Design <Typography.Text> instead of HTML <div> or <span>
export const HeaderTitle = styled(Text)`
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
  color: #00009c;
`;

export const HeaderSubtitle = styled(Text)`
  font-size: 0.85rem;
  color: #8c8c8c;
`;

export const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  background: #f5f5f5;
  overflow-y: auto;
  flex: 1;
`;