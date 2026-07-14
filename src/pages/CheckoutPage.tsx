import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { Form, Input, Button, Card, Row, Col, Radio, Result, Divider, message } from 'antd';
import { ShoppingCartOutlined, CreditCardOutlined, CarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { clearBox } from '../store/cartSlice'; 
import { placeNewOrder } from '../store/orderSlice';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  const [isOrdered, setIsOrdered] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const boxSize = useSelector((state: RootState) => state.cart.boxSize);

 
  const subtotal = cartItems.reduce((sum: number, item: any) => sum + (Number(item.price) || 0), 0);
  const deliveryFee = cartItems.length > 0 ? 150 : 0; // Standard delivery fee of Rs. 150 if there are items in the cart
  const totalAmount = subtotal + deliveryFee;

  const onFinish = (values: any) => {
  const generatedOrderId = `EXY-${Math.floor(10000 + Math.random() * 90000)}`;
    const cookieCounts = cartItems.reduce((acc: Record<string, number>, item: any) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {});  
    const contentsString = Object.entries(cookieCounts)
      .map(([name, count]) => `${count}x ${name}`)
      .join(', ');
  dispatch(placeNewOrder({
      id: generatedOrderId,
      customerName: `${values.firstName} ${values.lastName}`,
      boxSize: `${boxSize}-Pack Custom Box`,
      contents: contentsString,
      totalPrice: totalAmount,
      status: 'Pending',
      timestamp: 'Just now'
    }));
    setConfirmedOrderId(generatedOrderId);
    setIsOrdered(true);
    dispatch(clearBox());
    
    message.success("Order dispatched successfully! 🍪");
  };


  if (isOrdered) {
    return (
      <div style={{ padding: '60px 24px', display: 'flex', justifyContent: 'center' }}>
        <Card bordered={false} style={{ maxWidth: 600, width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Result
            status="success"
            title={<span style={{ color: '#00009c', fontWeight: 800 }}>Order Confirmed!</span>}
            subTitle={
              <div>
                <p>Your delicious cookie box is being prepared and will head your way shortly.</p>
                
                {/* 📦 BOLD TRACKING BOX */}
                <div style={{ 
                  background: '#f0f2f5', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  margin: '24px 0',
                  border: '1px dashed #00009c' 
                }}>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '4px' }}>
                    YOUR TRACKING NUMBER:
                  </span>
                  <strong style={{ fontSize: '1.4rem', color: '#00009c', letterSpacing: '1px' }}>
                    {confirmedOrderId}
                  </strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#888' }}>
                    Copy this code to track your bake status live!
                  </p>
                </div>
              </div>
            }
            extra={[
              <Button 
                type="primary" 
                key="track" 
                style={{ background: '#00009c', borderColor: '#00009c', height: '40px', fontWeight: 700, marginRight: '8px' }}
                onClick={() => navigate('/track-order')}
              >
                Track My Order
              </Button>,
              <Button 
                key="home" 
                style={{ height: '40px', fontWeight: 600 }}
                onClick={() => navigate('/')}
              >
                Back to Shop
              </Button>
            ]}
          />
        </Card>
      </div>
    );
  }

  
  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <Result
          status="warning"
          title="Your Cart is Empty"
          extra={<Button type="primary" style={{ background: '#00009c', borderColor: '#00009c' }} onClick={() => navigate('/')}>Fill Your Box</Button>}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#00009c', fontWeight: 800, marginBottom: 24 }}>DELIVERY & CHECKOUT</h1>
      
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[24, 24]}>
          {/* LEFT COLUMN: CONTACT & SHIPPING INFO */}
          <Col xs={24} lg={14}>
            <Card title={<span style={{ color: '#00009c', fontWeight: 700 }}>1. Delivery Address</span>} bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Required' }]}>
                    <Input size="large" placeholder="First Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Required' }]}>
                    <Input size="large" placeholder="Last Name" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Required' }]}>
                <Input size="large" placeholder="e.g. 03001234567" />
              </Form.Item>

              <Form.Item name="address" label="Street Address" rules={[{ required: true, message: 'Required' }]}>
                <Input.TextArea rows={3} placeholder="Apartment, hostel, street address, area..." />
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
            </Card>

            <Card title={<span style={{ color: '#00009c', fontWeight: 700 }}>2. Payment Method</span>} bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Radio.Group 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                style={{ width: '100%' }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card hoverable style={{ border: paymentMethod === 'cod' ? '1px solid #00009c' : '1px solid #f0f0f0' }}>
                      <Radio value="cod">
                        <span style={{ fontWeight: 600, marginLeft: 8 }}><CarOutlined /> Cash on Delivery (COD)</span>
                      </Radio>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card hoverable style={{ border: paymentMethod === 'card' ? '1px solid #00009c' : '1px solid #f0f0f0' }}>
                      <Radio value="card">
                        <span style={{ fontWeight: 600, marginLeft: 8 }}><CreditCardOutlined /> Card Payment</span>
                      </Radio>
                    </Card>
                  </Col>
                </Row>
              </Radio.Group>
            </Card>
          </Col>

          {/* RIGHT COLUMN: ORDER DETAILS SUMMARY */}
          <Col xs={24} lg={10}>
            <Card 
              title={<span style={{ color: '#00009c', fontWeight: 700 }}><ShoppingCartOutlined /> Order Summary Matrix</span>} 
              bordered={false} 
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'sticky', top: '24px' }}
            >
              {cartItems.map((item: any, idx: number) => (
                <div key={`${item.id}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ color: '#333' }}>
                    1x <strong>{item.name}</strong>
                  </span>
                  <span style={{ color: '#666' }}>Rs. {item.price}</span>
                </div>
              ))}

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span>Selected Box Size:</span>
                <strong>{boxSize}-Pack Selection</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span>Subtotal:</span>
                <strong>Rs. {subtotal}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span>Delivery Charges:</span>
                <span>Rs. {deliveryFee}</span>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: '1.3rem', color: '#00009c' }}>
                <span>Total Amount:</span>
                <strong>Rs. {totalAmount}</strong>
              </div>

              <Button 
                type="primary" 
                htmlType="submit"
                block 
                size="large" 
                style={{ background: '#00009c', borderColor: '#00009c', fontWeight: 700, height: '50px' }}
              >
                PLACE SECURE ORDER (Rs. {totalAmount})
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CheckoutPage;