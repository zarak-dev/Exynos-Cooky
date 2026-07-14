// src/pages/CartPage.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { Table, Button, Card, Row, Col, Empty, message, Radio } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { removeCookieFromBox, setBoxSize} from '../store/cartSlice'; 

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const boxSize = useSelector((state: RootState) => state.cart.boxSize);
  // Grab your standard cart items array
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // 🌟 Simple calculation: sum of all individual cookie prices currently in the cart
  const subtotal = cartItems.reduce((acc, item: any) => acc + item.price, 0);
  const deliveryFee = subtotal > 0 ? 150 : 0; // Standard 150 Rs delivery charge
  const totalAmount = subtotal + deliveryFee;

  const columns = [
    {
      title: 'COOKIE',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {record.imageUrl && (
            <img src={record.imageUrl} alt={text} style={{ width: 60, height: 60, borderRadius: 6, objectFit: 'cover' }} />
          )}
          <strong style={{ color: '#00009c' }}>{text}</strong>
        </div>
      ),
    },
    {
      title: 'PRICE',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span>Rs. {price}</span>,
    },
    {
      title: 'REMOVE',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any, index: number) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => {
            // 🌟 Dispatch your standard removal action using the cookie's unique ID
            dispatch(removeCookieFromBox(index));
            message.success(`"${record.name}" removed from cart.`);
          }} 
        />
      ),
    },
  ];

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', background: '#fff', borderRadius: 8 }}>
        <Empty description="Your shopping cart is empty!" />
        <Button type="primary" style={{ background: '#00009c', borderColor: '#00009c', marginTop: 16 }} onClick={() => navigate('/')}>
          <ArrowLeftOutlined /> Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#00009c', fontWeight: 800, marginBottom: 24 }}>YOUR CART</h1>
      
      <Row gutter={[24, 24]}>
        {/* LEFT COLUMN: LIST OF ADDED COOKIES */}
        <Col xs={24} lg={16}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Table 
              dataSource={cartItems} 
              columns={columns} 
              rowKey={(record, index) => `${record.id}-${index}`} // Safely handles duplicates of the same cookie
              pagination={false} 
            />
          </Card>
        </Col>

        {/* RIGHT COLUMN: STANDARD ORDER SUMMARY */}
        <Col xs={24} lg={8}>
          <Card 
            title={<span style={{ color: '#00009c', fontWeight: 700 }}>Order Summary</span>}
            bordered={false} 
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            {/* 📦 LIVE BOX SIZING SELECTOR */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>
                BOX SIZE TIER:
              </span>
              <Radio.Group 
                value={boxSize} 
                buttonStyle="solid" 
                style={{ width: '100%', display: 'flex' }}
                onChange={(e) => {
                  // This updates the limit in your Redux state
                  dispatch(setBoxSize(Number(e.target.value) as 4 | 6 | 12));
                }}
              >
                <Radio.Button value={4} style={{ flex: 1, textAlign: 'center', borderColor: '#00009c' }}>4-Pack</Radio.Button>
                <Radio.Button value={6} style={{ flex: 1, textAlign: 'center', borderColor: '#00009c' }}>6-Pack</Radio.Button>
                <Radio.Button value={12} style={{ flex: 1, textAlign: 'center', borderColor: '#00009c' }}>12-Pack</Radio.Button>
              </Radio.Group>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span>Cookies in Box:</span>
              <strong style={{ color: cartItems.length === boxSize ? '#52c41a' : '#fa8c16' }}>
                {cartItems.length} / {boxSize}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span>Subtotal:</span>
              <strong>Rs. {subtotal}</strong>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span>Delivery Charges:</span>
              <span>Rs. {deliveryFee}</span>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '16px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: '1.2rem', color: '#00009c' }}>
              <span>Total:</span>
              <strong>Rs. {totalAmount}</strong>
            </div>

            {/* 🔒 SMART CHECKOUT BUTTON */}
            <Button 
              type="primary" 
              block 
              size="large" 
              // 🌟 Keeps button disabled unless the box is perfectly filled!
              disabled={cartItems.length !== boxSize} 
              style={{ background: '#00009c', borderColor: '#00009c', fontWeight: 700 }}
              onClick={() => message.success("Proceeding to checkout!")}
            >
              {cartItems.length === boxSize 
                ? "PROCEED TO CHECKOUT" 
                : `ADD ${boxSize - cartItems.length} MORE COOKIES TO CHECKOUT`
              }
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;