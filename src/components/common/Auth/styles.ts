import styled from 'styled-components';
import { Button, Form, Input, Typography } from 'antd';

const { Title, Text } = Typography;

export const AuthTitle = styled(Title)`
  color: #00009c !important;
  font-weight: 800 !important;
  text-transform: uppercase;
  text-align: center;
  margin: 0 !important;
`;

export const StyledForm = styled(Form)`
  margin-top: 24px;
`;

export const StyledInput = styled(Input)`
  border-radius: 0;
  height: 40px;
`;

export const StyledPasswordInput = styled(Input.Password)`
  border-radius: 0;
  height: 40px;
`;

export const SubmitFormItem = styled(Form.Item)`
  margin-top: 32px;
  margin-bottom: 0;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  border-radius: 0px;
  background-color: #00009c;
  border-color: #00009c;
  font-weight: 700;
  text-transform: uppercase;
  height: 45px;

  &:hover, &:focus {
    background-color: #000066 !important;
    border-color: #000066 !important;
  }
`;

export const SwitchTextWrapper = styled(Text)`
  display: block;
  text-align: center;
  margin-top: 16px;
  font-size: 0.85rem;
  color: #666;
`;

export const ActionText = styled(Text)`
  color: #00009c;
  font-weight: 700;
  cursor: pointer;
  
  &:hover { 
    text-decoration: underline; 
  }
`;