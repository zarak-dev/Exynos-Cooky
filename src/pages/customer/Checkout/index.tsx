import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Row, Col, Radio, Result, Divider, message, Typography } from 'antd';
import { ShoppingCartOutlined, CreditCardOutlined, CarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../../../store';
import { clearBox } from '../../../store/slices/cartSlice'; 
import { placeNewOrder } from '../../../store/slices/orderSlice';

import { 
  CheckoutContainer, CenteredContainer, StyledCard, OrderSummarySticky, SuccessCard, 
  SectionTitle, SuccessTitle, TotalText, BrandButton, SubmitButton, TrackingBox, 
  TrackingLabel, TrackingNumber, TrackingSubtext, SummaryRow, TotalRow, 
  FullWidthRadioGroup, PaymentMethodCard, PaymentLabel 
} from './styles';

const { Text, Paragraph } = Typography;

interface CartItem {
  id: number;
  name: string;
  price: number;
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  const [isOrdered, setIsOrdered] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const cartItems = useSelector((state: RootState) => state.cart.items as CartItem[]);
  const boxSize = useSelector((state: RootState) => state.cart.boxSize);

  // 🌟 MEMOIZED AGGREGATION: Groups duplicate items together
  const groupedCartItems = useMemo(() => {
    const map = new Map<string, { id: number; name: string; price: number; quantity: number; totalPrice: number }>();

    cartItems.forEach((item) => {
      const existing = map.get(item.name);
      if (existing) {
        existing.quantity += 1;
        existing.totalPrice += Number(item.price) || 0;
      } else {
        map.set(item.name, {
          id: item.id,
          name: item.name,
          price: Number(item.price) || 0,
          quantity: 1,
          totalPrice: Number(item.price) || 0,
        });
      }
    });

    return Array.from(map.values());
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [cartItems]);

  const deliveryFee = cartItems.length > 0 ? 150 : 0;
  const totalAmount = subtotal + deliveryFee;

  const onFinish = (values: any) => {
    const generatedOrderId = `EXY-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Clean data mapping with strict types
    const cookieCounts = cartItems.reduce((acc: Record<string, number>, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {});  
    
    const contentsString = Object.entries(cookieCounts)
      .map(([name, count]) => `${count}x ${name}`)
      .join(', ');

    dispatch(placeNewOrder({
      id: generatedOrderId,
      customerName: `${values.firstName} ${values.lastName}`,
      // customerEmail: values.email, // Kept commented out to prevent Redux TS error
      boxSize: `${boxSize}-Pack Custom Box`,
      contents: contentsString,
      totalPrice: totalAmount,
      status: 'Pending',
      timestamp: new Date().toISOString()
    }));

    setConfirmedOrderId(generatedOrderId);
    setIsOrdered(true);
    dispatch(clearBox());
    message.success("Order dispatched successfully! 🍪");
  };

  if (isOrdered) {
    return (
      <CenteredContainer>
        <SuccessCard bordered={false}>
          <Result
            status="success"
            title={<SuccessTitle level={3}>Order Confirmed!</SuccessTitle>}
            subTitle={
              <>
                <Paragraph>Your delicious cookie box is being prepared and will head your way shortly.</Paragraph>
                <TrackingBox vertical align="center">
                  <TrackingLabel type="secondary">YOUR TRACKING NUMBER:</TrackingLabel>
                  <TrackingNumber>{confirmedOrderId}</TrackingNumber>
                  <TrackingSubtext type="secondary">Copy this code to track your bake status live!</TrackingSubtext>
                </TrackingBox>
              </>
            }
            extra={[
              <BrandButton type="primary" key="track" size="large" onClick={() => navigate('/track-order')}>
                Track My Order
              </BrandButton>,
              <Button key="home" size="large" onClick={() => navigate('/')}>
                Back to Shop
              </Button>
            ]}
          />
        </SuccessCard>
      </CenteredContainer>
    );
  }

  if (cartItems.length === 0) {
    return (
      <CenteredContainer>
        <Result
          status="warning"
          title="Your Cart is Empty"
          extra={
            <BrandButton type="primary" size="large" onClick={() => navigate('/')}>
              Fill Your Box
            </BrandButton>
          }
        />
      </CenteredContainer>
    );
  }

  return (
    <CheckoutContainer>
      <SectionTitle level={2}>DELIVERY & CHECKOUT</SectionTitle>
      
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[24, 24]}>
          
          <Col xs={24} lg={14}>
            <StyledCard title="1. Delivery Address" bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Required' }, { pattern: /^[a-zA-Z\s]+$/, message: 'Letters only' }]}>
                    <Input size="large" placeholder="First Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Required' }, { pattern: /^[a-zA-Z\s]+$/, message: 'Letters only' }]}>
                    <Input size="large" placeholder="Last Name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="email" label="Email Address" rules={[{ required: true, message: 'Required' }, { type: 'email', message: 'Invalid email' }]}>
                    <Input size="large" placeholder="user@exynos.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Required' }, { pattern: /^[0-9]+$/, message: 'Numbers only' }, { min: 10, message: 'Too short' }]}>
                    <Input size="large" placeholder="e.g. 03001234567" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="address" label="Street Address" rules={[{ required: true, message: 'Address required' }]}>
                <Input.TextArea rows={3} placeholder="Apartment, area, street..." />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="city" label="City" rules={[{ required: true, message: 'Required' }]} initialValue="Islamabad">
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="zipCode" label="Postal Code">
                    <Input size="large" placeholder="e.g. 44000" />
                  </Form.Item>
                </Col>
              </Row>
            </StyledCard>

            <StyledCard title="2. Payment Method" bordered={false}>
              <FullWidthRadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <PaymentMethodCard hoverable $isActive={paymentMethod === 'cod'}>
                      <Radio value="cod">
                        <PaymentLabel strong><CarOutlined /> Cash on Delivery</PaymentLabel>
                      </Radio>
                    </PaymentMethodCard>
                  </Col>
                  <Col span={12}>
                    <PaymentMethodCard hoverable $isActive={paymentMethod === 'card'}>
                      <Radio value="card">
                        <PaymentLabel strong><CreditCardOutlined /> Card Payment</PaymentLabel>
                      </Radio>
                    </PaymentMethodCard>
                  </Col>
                </Row>
              </FullWidthRadioGroup>
            </StyledCard>
          </Col>

          <Col xs={24} lg={10}>
            <OrderSummarySticky title={<><ShoppingCartOutlined /> Order Summary Matrix</>} bordered={false}>
              {/* 🌟 Renders the grouped items here */}
              {groupedCartItems.map((item) => (
                <SummaryRow key={item.name} justify="space-between">
                  <Text type="secondary">{item.quantity}x <Text strong>{item.name}</Text></Text>
                  <Text type="secondary">Rs. {item.totalPrice}</Text>
                </SummaryRow>
              ))}

              <Divider />

              <SummaryRow justify="space-between">
                <Text>Selected Box Size:</Text>
                <Text strong>{boxSize}-Pack Selection</Text>
              </SummaryRow>
              <SummaryRow justify="space-between">
                <Text>Subtotal:</Text>
                <Text strong>Rs. {subtotal}</Text>
              </SummaryRow>
              <SummaryRow justify="space-between">
                <Text>Delivery Charges:</Text>
                <Text>Rs. {deliveryFee}</Text>
              </SummaryRow>

              <Divider />

              <TotalRow justify="space-between" align="center">
                <TotalText level={4}>Total Amount:</TotalText>
                <TotalText level={4}>Rs. {totalAmount}</TotalText>
              </TotalRow>

              <SubmitButton type="primary" htmlType="submit" block size="large">
                PLACE SECURE ORDER (Rs. {totalAmount})
              </SubmitButton>
            </OrderSummarySticky>
          </Col>
        </Row>
      </Form>
    </CheckoutContainer>
  );
};

export default CheckoutPage;