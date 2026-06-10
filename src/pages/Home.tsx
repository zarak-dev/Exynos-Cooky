// src/pages/home.tsx
import React from 'react';
import { Row, Col, Card } from 'antd';
import { COOKIE_MOCK_DATA, type Cookie } from '../utils/mockData';
import {
  HomeContainer,
  PageTitle,
  StyledCard,
  CardHeader,
  CookieTitle,
  PriceTag,
  StyledButton,
  OutOfStockBadge
} from './home.styles';

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <PageTitle>This Week's Menu</PageTitle>
      
      <Row gutter={[24, 24]}>
        {COOKIE_MOCK_DATA.map((cookie: Cookie) => (
          <Col xs={24} sm={12} md={8} key={cookie.id}>
            <StyledCard
              $isAvailable={cookie.isAvailable}
              hoverable
              cover={<img alt={cookie.name} src={cookie.imageUrl} />}
            >
              <CardHeader>
                <CookieTitle>{cookie.name}</CookieTitle>
                {cookie.isAvailable ? (
                  <PriceTag>Rs. {cookie.price}</PriceTag>
                ) : (
                  <OutOfStockBadge>Sold Out</OutOfStockBadge>
                )}
              </CardHeader>
              
              <Card.Meta 
                description={cookie.description} 
                style={{ marginBottom: '16px', minHeight: '60px' }}
              />

              <StyledButton 
                type="primary" 
                disabled={!cookie.isAvailable}
              >
                {cookie.isAvailable ? 'Add to Box' : 'Unavailable'}
              </StyledButton>
            </StyledCard>
          </Col>
        ))}
      </Row>
    </HomeContainer>
  );
};

export default Home;