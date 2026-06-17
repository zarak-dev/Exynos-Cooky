import React from 'react';
import { Drawer, Button, Radio, List, Avatar } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../../store';
import { setCartOpen, setBoxSize, removeCookieFromBox, type BoxSize } from '../../store/cartSlice';
import styled from 'styled-components';

const DrawerTitle = styled.h2`
  color: #00009c;
  font-weight: 800;
  text-transform: uppercase;
  margin: 0;
  font-size: 1.3rem;
  font-family: 'Poppins', sans-serif;
`;

const SectionLabel = styled.label`
  font-weight: 700;
  display: block;
  margin: 20px 0 8px 0;
  font-size: 0.8rem;
  color: #00009c;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: 'Poppins', sans-serif;
`;

const BoxTierWrapper = styled.div`
  margin-bottom: 16px;
  
  .ant-radio-group {
    width: 100%;
    display: flex;
    border: 2px solid #00009c;
  }
  
  .ant-radio-button-wrapper {
    flex: 1;
    text-align: center;
    border: none !important;
    border-radius: 0px !important;
    font-weight: 700;
    color: #00009c;
    height: 40px;
    line-height: 38px;
    font-family: 'Poppins', sans-serif;
    text-transform: uppercase;
    font-size: 0.85rem;

    &::before { display: none !important; }
  }

  .ant-radio-button-wrapper-checked {
    background-color: #00009c !important;
    color: #ffffff !important;
  }
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background: #fafafa;
  padding: 16px;
  border: 1px solid #e8e8e8;
`;

const CookieSlot = styled.div<{ $filled: boolean }>`
  aspect-ratio: 1;
  border: ${props => props.$filled ? '2px solid #00009c' : '2px dashed #ccc'};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$filled ? '#ffffff' : 'transparent'};
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  height: 50px;
  background-color: #00009c;
  border-color: #00009c;
  color: #ffffff;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 0px;
  letter-spacing: 0.5px;
  margin-top: 20px;
  font-family: 'Poppins', sans-serif;

  &:hover, &:focus {
    background-color: #000066 !important;
    border-color: #000066 !important;
    color: #ffffff !important;
  }
`;

export const CartDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const { isCartOpen, items, boxSize } = useSelector((state: RootState) => state.cart);

  // Pad or map items into layout arrays to display placeholders for remaining slots
  const visualSlots = Array.from({ length: boxSize }, (_, i) => items[i] || null);
  const totalCost = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <Drawer
      title={<DrawerTitle>Your Cookie Box</DrawerTitle>}
      placement="right"
      width={400}
      onClose={() => dispatch(setCartOpen(false))}
      open={isCartOpen}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Box Configuration Selector */}
      <SectionLabel style={{ marginTop: 0 }}>Select Box Size</SectionLabel>
      <BoxTierWrapper>
        <Radio.Group 
          value={boxSize} 
          onChange={(e) => dispatch(setBoxSize(e.target.value as BoxSize))}
          optionType="button"
        >
          <Radio.Button value={4}>4-Pack</Radio.Button>
          <Radio.Button value={6}>6-Pack</Radio.Button>
          <Radio.Button value={12}>12-Pack</Radio.Button>
        </Radio.Group>
      </BoxTierWrapper>

      {/* Visual Box Slot Progress Mapping Grid */}
      <SectionLabel>
        Box Progress ({items.length} / {boxSize} Slots Filled)
      </SectionLabel>
      <SlotGrid>
        {visualSlots.map((item, index) => (
          <CookieSlot key={index} $filled={!!item} title={item ? item.name : 'Empty Cookie Slot'}>
            {item ? (
              <img src={item.imageUrl} alt={item.name} />
            ) : (
              <span style={{ color: '#ccc', fontSize: '1.2rem', fontWeight: 300 }}>+</span>
            )}
          </CookieSlot>
        ))}
      </SlotGrid>

      {/* Itemized Checkout Breakdown */}
      <SectionLabel>Itemized Breakdown</SectionLabel>
      <List
        itemLayout="horizontal"
        dataSource={items}
        locale={{ emptyText: 'Your customized baking box is currently empty.' }}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => dispatch(removeCookieFromBox(index))} 
              />
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.imageUrl} shape="square" size={40} />}
              title={<span style={{ fontWeight: 700, color: '#00009c', fontSize: '0.9rem' }}>{item.name}</span>}
              description={`Rs. ${item.price}`}
            />
          </List.Item>
        )}
      />

      {/* Drawer Sticky Total Footer Container */}
      <div style={{ marginTop: '40px', borderTop: '2px solid #f0f0f0', paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#00009c' }}>
          <span>TOTAL PRICE:</span>
          <span>Rs. {totalCost}</span>
        </div>
        <CheckoutButton type="primary" disabled={items.length === 0}>
          Proceed to Checkout
        </CheckoutButton>
      </div>
    </Drawer>
  );
};