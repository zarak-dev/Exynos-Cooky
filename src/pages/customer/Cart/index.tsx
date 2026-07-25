import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Row, Col, Empty, message, Radio, Typography, Flex, Avatar } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../../../store';
import { removeCookieFromBox, setBoxSize, addCookieToBox } from '../../../store/slices/cartSlice'; 

import { 
  CartContainer, EmptyCartContainer, StyledCard, PageTitle, SummaryTitle, 
  BoxTierLabel, StyledRadioGroup, SummaryRow, TotalRow, TotalText, ActionButton, 
  RadioGroupWrapper, QuantityControl, QuantityText, 
  CookieNameText, BoxCapacityText, SpacedDivider, ContinueButton // 🌟 New Imports
} from './styles';

const { Text } = Typography;

interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

interface GroupedCartItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  totalPrice: number;
  indices: number[]; 
}

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const boxSize = useSelector((state: RootState) => state.cart.boxSize);
  const cartItems = useSelector((state: RootState) => state.cart.items as CartItem[]);

  const groupedCartItems = useMemo(() => {
    const map = new Map<string, GroupedCartItem>();

    cartItems.forEach((item, index) => {
      const existing = map.get(item.name);
      if (existing) {
        existing.quantity += 1;
        existing.totalPrice += Number(item.price) || 0;
        existing.indices.push(index); 
      } else {
        map.set(item.name, {
          id: item.id,
          name: item.name,
          price: Number(item.price) || 0,
          imageUrl: item.imageUrl,
          quantity: 1,
          totalPrice: Number(item.price) || 0,
          indices: [index],
        });
      }
    });

    return Array.from(map.values());
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  }, [cartItems]);

  const deliveryFee = subtotal > 0 ? 150 : 0; 
  const totalAmount = subtotal + deliveryFee;

  const columns = [
    {
      title: 'COOKIE',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: GroupedCartItem) => (
        <Flex align="center" gap="middle">
          {record.imageUrl && (
            <Avatar shape="square" size={60} src={record.imageUrl} />
          )}
          <CookieNameText strong>{text}</CookieNameText>
        </Flex>
      ),
    },
    {
      title: 'QTY',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      width: 160,
      render: (quantity: number, record: GroupedCartItem) => (
        <QuantityControl align="center" justify="space-between">
          <Button 
            type="text" 
            size="small"
            icon={<MinusOutlined />} 
            onClick={() => {
              const indexToDelete = record.indices[record.indices.length - 1];
              dispatch(removeCookieFromBox(indexToDelete));
            }}
          />
          <QuantityText>{quantity}</QuantityText>
          <Button 
            type="text" 
            size="small"
            icon={<PlusOutlined />} 
            disabled={cartItems.length >= boxSize}
            onClick={() => {
              if (cartItems.length < boxSize) {
                dispatch(addCookieToBox({
                  id: record.id,
                  name: record.name,
                  price: record.price,
                  imageUrl: record.imageUrl || '',
                  description: '',
                  isAvailable: false
                }));
              } else {
                message.warning(`Your ${boxSize}-Pack is already full!`);
              }
            }}
          />
        </QuantityControl>
      ),
    },
    {
      title: 'TOTAL',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => <Text>Rs. {price}</Text>,
    },
    {
      title: 'REMOVE',
      key: 'action',
      width: 140,
      align: 'center' as const,
      render: (_: any, record: GroupedCartItem) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => {
            const indexToDelete = record.indices[record.indices.length - 1];
            dispatch(removeCookieFromBox(indexToDelete));
            message.success(`One "${record.name}" removed from cart.`);
          }} 
        />
      ),
    },
  ];

  if (cartItems.length === 0) {
    return (
      <EmptyCartContainer vertical align="center" justify="center">
        <Empty description="Your shopping cart is empty!" />
        {/* 🌟 Zero inline styles */}
        <ContinueButton type="primary" onClick={() => navigate('/')}>
          <ArrowLeftOutlined /> Continue Shopping
        </ContinueButton>
      </EmptyCartContainer>
    );
  }

  return (
    <CartContainer>
      <PageTitle level={2}>YOUR CART</PageTitle>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <StyledCard bordered={false}>
            <Table 
              dataSource={groupedCartItems} 
              columns={columns} 
              rowKey="name" 
              pagination={false} 
              scroll={{ x: 600 }}
            />
          </StyledCard>
        </Col>

        <Col xs={24} lg={8}>
          <StyledCard title={<SummaryTitle>Order Summary</SummaryTitle>} bordered={false}>
            
            <RadioGroupWrapper vertical>
              <BoxTierLabel type="secondary">BOX SIZE TIER:</BoxTierLabel>
              <StyledRadioGroup 
                value={boxSize} 
                buttonStyle="solid" 
                onChange={(e) => dispatch(setBoxSize(Number(e.target.value) as 4 | 6 | 12))}
              >
                <Radio.Button value={4}>4-Pack</Radio.Button>
                <Radio.Button value={6}>6-Pack</Radio.Button>
                <Radio.Button value={12}>12-Pack</Radio.Button>
              </StyledRadioGroup>
            </RadioGroupWrapper>

            <SummaryRow justify="space-between">
              <Text>Cookies in Box:</Text>
              {/* 🌟 Zero inline styles, passing boolean for dynamic color */}
              <BoxCapacityText strong $isFull={cartItems.length === boxSize}>
                {cartItems.length} / {boxSize}
              </BoxCapacityText>
            </SummaryRow>

            <SummaryRow justify="space-between">
              <Text>Subtotal:</Text>
              <Text strong>Rs. {subtotal}</Text>
            </SummaryRow>
            
            <SummaryRow justify="space-between">
              <Text>Delivery Charges:</Text>
              <Text>Rs. {deliveryFee}</Text>
            </SummaryRow>
            
            {/* 🌟 Zero inline styles */}
            <SpacedDivider />
            
            <TotalRow justify="space-between" align="center">
              <TotalText strong>Total:</TotalText>
              <TotalText strong>Rs. {totalAmount}</TotalText>
            </TotalRow>

            <ActionButton 
              type="primary" 
              block 
              size="large" 
              disabled={cartItems.length !== boxSize} 
              onClick={() => navigate('/checkout')}
            >
              {cartItems.length === boxSize 
                ? "PROCEED TO CHECKOUT" 
                : `ADD ${boxSize - cartItems.length} MORE TO CHECKOUT`
              }
            </ActionButton>
          </StyledCard>
        </Col>
      </Row>
    </CartContainer>
  );
};

export default CartPage;