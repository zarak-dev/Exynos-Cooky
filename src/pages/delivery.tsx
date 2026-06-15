// src/pages/delivery.tsx
import React, { useState } from 'react';
import { Modal, List, Button } from 'antd';
import {
  DeliveryPageContainer,
  ActiveSelectionBanner,
  ModalTitle,
  OptionGrid,
  ChoiceCard,
  SearchWrapper,
  StyledInput,
  PrimaryActionBtn,
  StoreList,
  StoreName,
  StoreAddress
} from './delivery.styles';

type ModeSelection = 'none' | 'delivery' | 'pickup';

interface StoreLocation {
  id: string;
  name: string;
  address: string;
}

const MOCK_STORES: StoreLocation[] = [
  { id: 'store-1', name: 'Exynos Cooky - Blue Area', address: 'Block 7, G-7/3, Islamabad' },
  { id: 'store-2', name: 'Exynos Cooky - F-11 Markaz', address: 'Shop 4, Sector F-11, Islamabad' },
  { id: 'store-3', name: 'Exynos Cooky - Bahria Town', address: 'Phase 7, Rawalpindi-Islamabad' },
];

const Delivery: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [activeMode, setActiveMode] = useState<ModeSelection>('none');
  const [addressInput, setAddressInput] = useState<string>('');
  const [confirmedSelection, setConfirmedSelection] = useState<string | null>(null);

  const handleConfirmDelivery = () => {
    if (!addressInput.trim()) return;
    setConfirmedSelection(`🚚 Delivery to: ${addressInput}`);
    setIsModalOpen(false);
  };

  const handleSelectStore = (store: StoreLocation) => {
    setConfirmedSelection(`🛍️ Pickup from: ${store.name}`);
    setIsModalOpen(false);
  };

  return (
    <DeliveryPageContainer>
      {confirmedSelection ? (
        <ActiveSelectionBanner>
          <h4 style={{ color: '#00009c', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
            Fulfillment Preference
          </h4>
          <p style={{ fontSize: '1.1rem', color: '#333', fontWeight: 500, margin: '0 0 24px 0' }}>
            {confirmedSelection}
          </p>
          <Button 
            style={{ borderRadius: 0, border: '2px solid #00009c', color: '#00009c', fontWeight: 700, textTransform: 'uppercase' }}
            onClick={() => {
              setActiveMode('none');
              setIsModalOpen(true);
            }}
          >
            Change Preference
          </Button>
        </ActiveSelectionBanner>
      ) : (
        <p style={{ color: '#999' }}>Please set your fulfillment method to view cookie availability parameters.</p>
      )}

        <Modal
        open={isModalOpen}
        closable={confirmedSelection !== null}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
        centered
        >
        <ModalTitle>How would you like your cookies?</ModalTitle>

        {/* Level 1: Choice Grid triggers step changes */}
        <OptionGrid>
          <ChoiceCard 
            $active={activeMode === 'delivery'} 
            onClick={() => setActiveMode('delivery')}
          >
            🚗 Delivery
          </ChoiceCard>
          <ChoiceCard 
            $active={activeMode === 'pickup'} 
            onClick={() => setActiveMode('pickup')}
          >
            🛍️ Pick Up
          </ChoiceCard>
        </OptionGrid>

        {/* Level 2: Conditional Render Zones */}
        {activeMode === 'delivery' && (
          <div>
            <label style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', color: '#00009c' }}>
              Enter Your Delivery Address
            </label>
            <SearchWrapper>
              <StyledInput 
                placeholder="Street, Building, Apartment, City..." 
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                onPressEnter={handleConfirmDelivery}
              />
              <PrimaryActionBtn onClick={handleConfirmDelivery} disabled={!addressInput.trim()}>
                Find
              </PrimaryActionBtn>
            </SearchWrapper>
          </div>
        )}

        {activeMode === 'pickup' && (
          <div>
            <label style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', color: '#00009c' }}>
              Select Nearest Store Location
            </label>
            <StoreList
              dataSource={MOCK_STORES}
              renderItem={(item: any) => (
                <List.Item onClick={() => handleSelectStore(item)}>
                  <div>
                    <StoreName>{item.name}</StoreName>
                    <StoreAddress>{item.address}</StoreAddress>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </DeliveryPageContainer>
  );
};

export default Delivery;